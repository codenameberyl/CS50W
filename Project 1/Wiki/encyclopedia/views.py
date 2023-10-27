from django import forms
from django.http.response import HttpResponseRedirect
from django.shortcuts import render, reverse
from django.views import View

from markdown2 import Markdown
import secrets

from . import util


class IndexView(View):
    def get(self, request):
        entries = util.list_entries()
        return render(request, "encyclopedia/index.html", {"entries": entries})


class EntryView(View):
    def get(self, request, entry):
        content = util.get_entry(entry)
        if content is None:
            return render(request, "encyclopedia/error.html", {"entry": entry})
        markdown = Markdown()
        html_content = markdown.convert(content)
        return render(request, "encyclopedia/entry.html", {"entry": html_content, "title": entry})


class SearchView(View):
    def get(self, request):
        query = request.GET.get("q", "")
        if util.get_entry(query) is not None:
            return HttpResponseRedirect(reverse("encyclopedia:entry", args=[query]))
        else:
            matching_entries = [entry for entry in util.list_entries() if query.lower() in entry.lower()]
            return render(request, "encyclopedia/index.html", {"entries": matching_entries, "search": True, "query": query})


class NewPageView(View):
    def get(self, request):
        form = NewPageForm()
        return render(request, "encyclopedia/new.html", {"form": form, "existing": False})

    def post(self, request):
        form = NewPageForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            content = form.cleaned_data["content"]
            edit = form.cleaned_data["edit"]
            if not edit and util.get_entry(title):
                return render(request, "encyclopedia/new.html", {"form": form, "existing": True, "entry": title})
            util.save_entry(title, content)
            return HttpResponseRedirect(reverse("encyclopedia:entry", args=[title]))


class EditPageView(View):
    def get(self, request, entry):
        content = util.get_entry(entry)
        if content is None:
            return render(request, "encyclopedia/error.html", {"title": entry})
        form = NewPageForm(initial={"title": entry, "content": content, "edit": True})
        form.fields["title"].widget = forms.HiddenInput()
        return render(request, "encyclopedia/new.html", {"form": form, "edit": True, "title": entry})


class RandomPageView(View):
    def get(self, request):
        entries = util.list_entries()
        random_entry = secrets.choice(entries)
        return HttpResponseRedirect(reverse("encyclopedia:entry", args=[random_entry]))


class NewPageForm(forms.Form):
    title = forms.CharField(
        label="Entry title",
        widget=forms.TextInput(attrs={"class": "form-control"}),
    )
    content = forms.CharField(
        widget=forms.Textarea(attrs={"class": "form-control", "rows": 20})
    )
    edit = forms.BooleanField(initial=False, widget=forms.HiddenInput(), required=False)
