from django import forms
from .models import Listing


class ListingForm(forms.ModelForm):
    class Meta:
        model = Listing
        fields = ['title', 'description', 'starting_bid', 'category', 'image']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Add the 'form-control' class to the widget of the 'content' field
        self.fields['title'].widget.attrs.update({'class': 'form-control'})
        self.fields['description'].widget.attrs.update({'class': 'form-control', 'cols': 30, 'rows': 5})
        self.fields['starting_bid'].widget.attrs.update({'class': 'form-control'})
        self.fields['category'].widget.attrs.update({'class': 'form-control'})
        self.fields['image'].widget.attrs.update({'class': 'form-control'})


class BidForm(forms.Form):
    amount = forms.DecimalField(max_digits=10, decimal_places=2)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Add the 'form-control' class to the widget of the 'content' field
        self.fields['amount'].widget.attrs.update({'class': 'form-control'})


class CommentForm(forms.Form):
    text = forms.CharField(widget=forms.Textarea)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Add the 'form-control' class to the widget of the 'content' field
        self.fields['text'].widget.attrs.update({'class': 'form-control'})
