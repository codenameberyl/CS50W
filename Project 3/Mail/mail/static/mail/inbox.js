document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email());

  // By default, load the inbox
  load_mailbox('inbox');

  // Add compose/send function
  send_mail();
});

function compose_email(email=null) {

  // Show compose view and hide other views
  document.querySelector('#compose-view').style.display = 'block';

  document.querySelector('#compose-view').style.opacity = 1;
  document.querySelector('#compose-view').style.zIndex = 9999;

  document.querySelector(".close").addEventListener("click", function() {
    document.querySelector('#compose-view').style.opacity = 0;
    document.querySelector('#compose-view').style.zIndex = -1;
  });

  // If this is a reply - populate with data
  if (email !== null) {
    document.querySelector("#replyNew").innerText = "Reply Mail"
    document.querySelector('#compose-recipients').value = email.sender;
    // Body = sender's mail + timestamp
    document.querySelector('#compose-body').value = `

    "On ${email.timestamp} ${email.sender} wrote:
      ${email.body}"
    `;
      // Add Re: only if it's a first reply
    if (email.subject?.slice(0,3) === "Re:") {
      document.querySelector('#compose-subject').value = email.subject;
    } else {
      document.querySelector('#compose-subject').value = "Re: " + email.subject;
    }
  }
  // Else - clear out composition fields
  else {
    document.querySelector("#replyNew").innerText = "New Mail"
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
  }
}

// Function handling sent email
function send_mail() {
  document.querySelector('#compose-form').addEventListener('submit', (event) => {
    event.preventDefault();

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
      // Show error if there is one
      if (Object.keys(result)[0] === 'error') {
        throw new Error(result.error);
      } else {
        load_mailbox('sent');
        alert(result.message);
      }
    })
    .catch(error => {
      alert(error);
    })
  });
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#details-view').style.display = 'none'
  document.querySelector('#compose-view').style.display = 'none';

  if (mailbox === 'inbox') {
    document.querySelector('#inbox').classList.add('active')
    document.querySelector('#sent').classList.remove('active')
    document.querySelector('#archived').classList.remove('active')
  }
  else if (mailbox === 'sent') {
    document.querySelector('#sent').classList.add('active')
    document.querySelector('#inbox').classList.remove('active')
    document.querySelector('#archived').classList.remove('active')
  }
  else if (mailbox === 'archive') {
    document.querySelector('#archived').classList.add('active')
    document.querySelector('#inbox').classList.remove('active')
    document.querySelector('#sent').classList.remove('active')
  }

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `
  <div class="mail"></div>
  <footer class="activity">
    <div class="footer-container">

      <div class="footer-item">
          <span class="progressbar" ></span>
          <a href="#" class="footer-link footer-text-sm">

              <div class="footer-group">
                  <span> 0 GB of 15 GB used</span>
                  <span>
                      <img style="height: 18px; width: 18px; margin: 0 8px; padding: 0;" src="static/mail/assets/icons/open_in_new_black_24dp.svg" alt="Google drive storage" class="btn-icon-alt btn-icon-sm">
                  </span>
              </div>

          </a>
      </div>

      <div class="footer-item">
          <a href="#" class="footer-link footer-text-sm">Terms</a>
          ·
          <a href="#" class="footer-link footer-text-sm">Privacy</a>
          ·
          <a href="#" class="footer-link footer-text-sm">Program Policies</a>
      </div>

      <div class="footer-item">
          <span class="footer-text-sm" >Last activity: 37 minutes ago</span>

          <div class="footer-group">
              <a href="#" class="footer-link footer-text-sm">Details</a>
          </div>
      </div>

    </div>
  </footer>`;

  let emailsViewDiv = document.querySelector('.mail');
  let unreadCount = 0;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Reset the unread count when loading a new mailbox
    unreadCount = 0;

    emails.forEach(email => {
      // Check if the email is unread and update count
      if (!email.read) {
        unreadCount++;
      }

      new_email_div(email, emailsViewDiv, mailbox);

      if (unreadCount === 0) {
        document.querySelector('#unread-count').textContent = ''
      }
      else {
        document.querySelector('#unread-count').textContent = `${unreadCount}`;
      }
    });


    // Sent mailbox doesn't have option to archive
    if (mailbox !== "sent") {
      // Listen for archive-icon click -> archive an email or unarchive-icon -> unarchive
      document.querySelectorAll(".archive-icon, .unarchive-icon").forEach(element => {
        element.addEventListener("click", (event) => {
          event.stopPropagation();
          // Get email's id
          let email = event.target.parentNode.parentNode.parentNode.parentNode.parentNode
          console.log(email.id)
          // Run hide animation
          email.style.animationPlayState = "running";

          // After animation - archive an email
          email.addEventListener("animationend", () => {
            // Check if archive or unarchive
            let toArchive = (event.target.parentNode.className === "btn archive-icon") ? true : false;

            // Archive/unarchive this email
            archive_control(email, event.target, toArchive);
          });
        })
      });
    }
  });
}

// Creates New Email Div for mailbox view
function new_email_div(email, emailsViewDiv, mailbox) {
  // Create New Container
  let emailDiv = document.createElement('div');
  emailDiv.id = email.id;
  emailDiv.className = 'inbox-message-container';

  // Save recipients/sender as a single variable
  let users = (mailbox === "sent") ? email.recipients[0] : email.sender;
  // Show additional recipients count only if overall count is greater than 1
  let usersCount = ((email.recipients.length > 1) && (mailbox === "sent")) ? `+${email.recipients.length-1}` : "";
  // Check if email is archived or not and set proper variables
  let isArchivedClass = (email.archived) ? "unarchive-icon" : "archive-icon";

  emailDiv.innerHTML = `
  <div class="inbox-message-item ${email.read ? 'message-default-unread' : ''}">

    <div class="checkbox" style="margin-right: -12px;" >
        <button class="btn">
            <img src="static/mail/assets/icons/check_box_outline_blank_black_24dp.svg" alt="Select" class="btn-icon-sm btn-icon-alt btn-icon-hover message-btn-icon">
        </button>
    </div>

    <div class="message-group-hidden">
        <button class="btn-alt btn-nofill drag-indicator" >
            <img src="static/mail/assets/icons/drag_indicator_black_24dp.svg" alt="Drag" class="btn-icon-sm btn-icon-alt btn-icon-disabled" >
        </button>
    </div>

    <button class="btn star" style="margin: 0;">
        <img src="static/mail/assets/icons/star_border_black_24dp.svg" alt="Not starred" class="btn-icon-sm btn-icon-alt btn-icon-hover message-btn-icon">
    </button>

    <div class="message-default" >

        <div class="message-sender message-content ${email.read ? '' : 'unread'}" >
            <span >${users}</span>
        </div>

        <div class="message-subject message-content ${email.read ? '' : 'unread'}">
            <span>${email.subject}</span>
        </div>

        <div class="message-seperator message-content"> - </div>

        <div class="message-body message-content">
            <span> ${email.body}</span>
        </div>

        <div class="gap message-content" > &nbsp; </div>

        <div class="message-date center-text ${email.read ? '' : 'unread'}" style="float: right;">
            <span>${email.timestamp}</span>
        </div>

    </div>

    <div class="message-group-hidden" >
        <div class="inbox-message-item-options">
            <button class="btn ${isArchivedClass}">
                <img src="static/mail/assets/icons/archive_black_24dp.svg" alt="Archive" class="btn-icon-sm btn-icon-alt btn-icon-hover">
            </button>

            <button class="btn">
                <img src="static/mail/assets/icons/delete_black_24dp.svg" alt="Delete" class="btn-icon-sm btn-icon-alt btn-icon-hover">
            </button>

            <button class="btn">
                <img src="static/mail/assets/icons/mark_as_unread_black_24dp.svg" alt="Mark as unread" class="btn-icon-sm btn-icon-alt btn-icon-hover">
            </button>

            <button class="btn">
                <img src="static/mail/assets/icons/access_time_filled_black_24dp.svg" alt="Snooze" class="btn-icon-sm btn-icon-alt btn-icon-hover">
            </button>
        </div>
    </div>

  </div>`;

  // Hide archive button for sent mailbox
  if (mailbox === 'sent') {
    emailDiv.querySelectorAll(".archive-icon, .unarchive-icon").forEach(element => {
      element.classList.add('hidden');
    });
  }

  // Listen for email block click -> open the email
  emailDiv.addEventListener('click', () => {
    view_email(email)
  })

  // Inject to the main mailbox container
  emailsViewDiv.appendChild(emailDiv);
}

function view_email(email) {

  // Show the details-view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#details-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';


  // Fill with email info
  document.querySelector("#details-view").innerHTML = `
    <div style="padding-right: 16px;">
      <div style="display: flex; align-items: flex-start; padding: 30px 0 8px 72px;">
        <div style="padding: 0!important; font-size: 0.875rem; margin-left: auto; order: 1;">
          <div class="bHJ" style="display: flex; align-items: center; margin-block: -6px; marging-right: -6px;">
            <span>
              <button class="pYTkkf-JX-I pYTkkf-JX-I-ql-ay5-ays bHI " aria-label="Print all" style="background: transparent; outline: none; border: none;">
                <span class="OiePBf-zPjgPe pYTkkf-JX-UHGRz"></span>
                <span class="bHC-Q "></span>
                <span aria-hidden="true" class="pYTkkf-JX-ank-Rtc0Jf">
                  <span class="bzc-ank" aria-hidden="true">
                    <svg focusable="false" height="20" viewBox="0 -960 960 960" width="20" class=" aoH"><path d="M648-624v-120H312v120h-72v-192h480v192h-72Zm-480 72h625-625Zm539.789 96Q723-456 733.5-466.289q10.5-10.29 10.5-25.5Q744-507 733.711-517.5q-10.29-10.5-25.5-10.5Q693-528 682.5-517.711q-10.5 10.29-10.5 25.5Q672-477 682.289-466.5q10.29 10.5 25.5 10.5ZM648-216v-144H312v144h336Zm72 72H240v-144H96v-240q0-40 28-68t68-28h576q40 0 68 28t28 68v240H720v144Zm73-216v-153.672Q793-530 781-541t-28-11H206q-16.15 0-27.075 11.04T168-513.6V-360h72v-72h480v72h73Z"></path></svg>
                  </span>
                </span>
                <div class="pYTkkf-JX-ano"></div>
              </button>
            </span>
            <span>
              <button class="pYTkkf-JX-I pYTkkf-JX-I-ql-ay5-ays bHI " aria-label="In new window" style="background: transparent; outline: none; border: none;">
                <span class="OiePBf-zPjgPe pYTkkf-JX-UHGRz"></span>
                <span class="bHC-Q "></span>
                <span aria-hidden="true" class="pYTkkf-JX-ank-Rtc0Jf">
                  <span class="bzc-ank" aria-hidden="true">
                    <svg focusable="false" height="20" viewBox="0 -960 960 960" width="20" class=" aoH aoG"><path d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h264v72H216v528h528v-264h72v264q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm171-192-51-51 357-357H576v-72h240v240h-72v-117L387-336Z"></path></svg>
                  </span>
                </span>
                <div class="pYTkkf-JX-ano"></div>
              </button>
            </span>
          </div>
        </div>
        <div>
          <div class="ha" style="background: inherit; background-color: transparent; border-right: inherit; color: #222; font-family: inherit; font-size: 1.37rem; font-weight: 500; line-height: 28px; margin: 0; padding: 0;">
            <h2 class="hP" style="font-family: 'Google Sans',Roboto,RobotoDraft,Helvetica,serif; font-size: 1.375rem; font-variant-ligatures: no-contextual; color: #1f1f1f; font-weight: 400; display: inline; margin: 0; padding: 0; font: inherit; border: 0; outline: none; padding-right: 10px; word-break: break-word;" tabindex="-1">${email.subject}</h2>
            <span class="J-J5-Ji">
              <div class="pG" aria-label="Important according to Google magic." role="switch" aria-checked="true" tabindex="0">
              </div>
            </span>
            <div class="dJ"></div>
          </div>
        </div>
      </div>

      <div id=":1ay">
        <div class="adn ads" style="display: flex; padding: 0; border-left: none;">
          <div class="aju" style="display: flex; float: none; height: 80px; padding: 0 16px; min-width: 40px; align-items: center;">
            <div class="aCi" style="position: relative; left: -9px; position: absolute; bottom: 0; top: 0; width: 2px;>
              <div class="aFg" style="display: none;"></div>
              <img id=":nj_5-e" name=":nj" style="border-radius: 50%; display: block; width: 40px; height: 40px;" src="https://lh3.googleusercontent.com/a/default-user=s40-p" class="ajn" style="background-color: #cccccc" aria-hidden="true">
            </div>
            <div class="gs" style="margin; 0; padding: 0 0 20px 0; width: 100%;">
              <div class="gE iv gt" style="padding: 20px 0 0 0; cursor: auto; padding-left: 0;">
                <table cellpadding="0" class="cf gJ" style="display: block; width: auto">
                  <tbody style="display: block;">
                    <tr class="acZ" style="display: flex; height: auto;">
                      <td class="gF gK" style="display: block; max-height: 20px; text-align: left; vertical-align: top; white-space: nowrap; width: 100%;">
                        <table cellpadding="0" class="cf ix">
                          <tbody>
                            <tr>
                              <td class="c2" style="display: flex;">
                                <h3 class="iw">
                                  <span translate="no" class="qu" role="gridcell" tabindex="-1">
                                    <span class="gD">
                                      <span style="font-family: 'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif; font-size: .875rem; font-weight: bold;">${email.sender}</span>
                                    </span>
                                  </span>
                                </h3>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    <td class="gH bAk" style="display: block; max-height: 20px; text-align: right; vertical-align: top; white-space: nowrap;">
                      <div class="gK" style="display:flex;">
                        <span></span>
                        <span id=":18p" class="g3" role="gridcell" tabindex="-1" style="font-family: 'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif; font-size: .75rem; letter-spacing: normal; color: #5e5e5e; display: block; line-height: 20px; margin: 0;">${email.timestamp}</span>
                        <div class="zd bi4" aria-label="Not starred" tabindex="0" role="checkbox" aria-checked="false" style="outline:0;margin-left:20px;display:inline-block;cursor:pointer;height:20px;" data-tooltip="Not starred">
                          <span class="T-KT" style="align-items:center;border:none;display:inline-flex;justify-content:center;outline:none;position:relative;z-index:0;padding:0;top:0;">
                            <img class="f T-KT-JX" src="static/mail/assets/icons/cleardot.gif" alt="">
                          </span>
                        </div>
                      </div>
                    </td>
                    <td class="gH" style="display: flex;"></td>
                    <td class="gH acX bAm" rowspan="2" style="display: flex;max-height:20px;">
                      <div class="T-I J-J5-Ji T-I-Js-IF aaq T-I-ax7 L3 reply" role="button" tabindex="0" data-tooltip="Reply" aria-label="Reply" style="align-items: center; border: none; display: inline-flex; justify-content: center; outline: none; position: relative; z-index: 0; min-width: 0; user-select: none; height: 20px; margin:0 0 0 20px; cursor: pointer;">
                        <img class="hB T-I-J3 " role="button" src="static/mail/assets/icons/reply_baseline_nv700_20dp.png" alt="">
                      </div>
                      <div id=":190" class="T-I J-J5-Ji T-I-Js-Gs aap T-I-awG T-I-ax7 L3" role="button" tabindex="0" aria-expanded="false" aria-haspopup="true" data-tooltip="More" aria-label="More" style="user-select: none;height:20px;margin:0 0 0 20px;">
                        <img class="hA T-I-J3" role="menu" src="static/mail/assets/icons/more_vert_baseline_nv700_20dp.png" alt="">
                      </div>
                    </td>
                  </tr>
                  <tr class="acZ xD">
                    <td colspan="3">
                      <table cellpadding="0" class="cf adz">
                        <tbody>
                          <tr>
                            <td class="ady" style="display:flex;line-height:20px;overflow:visible;text-overflow:ellipsis;white-space:nowrap;">
                              <div class="iw ajw" style=""display:inline-block;max-width:92%;overflow:hidden;white-space:nowrap;>
                                <span translate="no" class="hb" style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-size:.75rem;letter-spacing:normal;color:#5e5e5e;line-height:20px;">to <span class="g2">me</span> </span>
                              </div>
                              <div id=":18z" aria-haspopup="true" class="ajy hover" role="button" tabindex="0" aria-label="Show details" style="align-items: center;border: none;display: inline-flex;justify-content: center;outline: none;position: relative;z-index: 0;margin-left: 4px;vertical-align: top;">
                                <img class="ajz" src="static/mail/assets/icons/cleardot.gif" alt="">
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="ajA SK email_tooltip" tabindex="-1" style="visibility: hidden; left: 380px; top: 300px; display: none;">
              <div class="ajB gt" tabindex="-1">
                <table cellpadding="0" class="ajC">
                  <tbody>
                    <tr class="UszGxc ajv">
                      <td colspan="2" tabindex="0" class="gG">
                        <span class="gI">from:</span>
                      </td>
                      <td colspan="2" tabindex="0" class="gL">
                        <span class="gI"><span translate="no" class="qu" role="gridcell" tabindex="-1">
                          <span class="gD">
                            <span>${email.sender}</span>
                        </span>
                      </td>
                    </tr>
                    <tr class="ajv">
                      <td colspan="2" tabindex="0" class="gG">
                        <span class="gI">to:</span>
                      </td>
                      <td colspan="2" tabindex="0" class="gL">
                        <span class="gI">
                          <span>${email.recipients.join("; ")}</span>
                          <br>
                        </span>
                      </td>
                    </tr>
                    <tr class="ajv">
                      <td colspan="2" tabindex="0" class="gG">
                        <span class="gI">date:</span>
                      </td>
                      <td colspan="2" tabindex="0" class="gL">
                        <span class="gI">${email.timestamp}</span>
                      </td>
                    </tr>
                    <tr class="ajv">
                      <td colspan="2" tabindex="0" class="gG">
                        <span class="gI">subject:</span>
                      </td>
                      <td colspan="2" tabindex="0" class="gL">
                        <span class="gI">${email.subject}</span>
                      </td>
                    </tr>
                    <tr class="ajv">
                      <td colspan="2" tabindex="0" class="gG">
                        <span class="gI">mailed-by:</span>
                      </td>
                      <td colspan="2" tabindex="0" class="gL">
                        <span class="gI">test.example.com</span>
                      </td>
                    </tr>
                    <tr class="ajv">
                      <td colspan="2" tabindex="0" class="gG">
                        <span class="gI">signed-by:</span>
                      </td>
                      <td colspan="2" tabindex="0" class="gL">
                        <span class="gI">example.com</span>
                      </td>
                    </tr>
                    <tr class="ajv">
                      <td colspan="2" tabindex="0" class="gG">
                        <span class="gI">security:</span>
                      </td>
                      <td colspan="2" tabindex="0" class="gL">
                        <span class="gI"><span>
                        <img class="bg0" src="images/cleardot.gif" alt=""> Standard encryption (TLS)</span> <a href="https://support.google.com/mail?hl=en&amp;p=tls" target="_blank">Learn more</a></span>
                      </td>
                    </tr>
                    <tr class="ajv">
                      <td colspan="2" tabindex="0" class="gG">
                        <span class="gI">
                          <img width="10px" height="10px" class="aoj" aria-label="Importance" src="static/mail/assets/icons/label_important_fill_googyellow500_20dp.png" style="width: 19px; height: 19px;vertical-align: middle;">:
                        </span>
                      </td>
                      <td colspan="2" tabindex="0" class="gL">
                        <span class="gI">Important according to Example magic.</span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4">
                        <span class="gI">
                          <div class="pj1vZc"></div>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div id=":19b">
              <div class="qQVYZb"></div>
              <div class="utdU2e"></div>
              <div class="lQs8Hd"></div>
              <div class="btm"></div>
            </div>
            <div class="">
              <div class="aHl"></div>
              <div id=":18y" tabindex="-1">
            </div>
            <div id=":18n" class="ii gt">
              <div id=":198" class="a3s aiL ">
                <u></u>
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;height:100%!important;line-height:1.5;width:100%!important;background-color:#fff;margin:0;padding:0" bgcolor="#fff">
                  <table style="box-sizing:border-box;border-collapse:separate!important;width:100%;background-color:#fff" width="100%" bgcolor="#fff">
                    <tbody>
                      <tr>
                        <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;vertical-align:top" valign="top"></td>
                        <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;vertical-align:top;display:block;max-width:580px;width:580px;margin:0 auto;padding:24px" width="580" valign="top">
                          <div style="box-sizing:border-box;display:block;max-width:580px;margin:0 auto; font-size: 16px; font-family: 'Google Sans',Roboto,RobotoDraft,Helvetica,serif;">
                            <pre style="white-space: pre-line; word-break: break-word;">
                              ${email.body}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <div class="gA gt acV" style="width: auto; margin-bottom: 30px;">
          <div class="gB xu">
            <table id=":18w" cellpadding="0" role="presentation" class="cf gz ac0" style="margin: 0; position: relative; top: 1px; width: 100%; display: none!important; border-collapse: collapse;">
              <tbody>
                <tr>
                  <td>
                    <div class="cKWzSc mD" idlink="" tabindex="0" role="button">
                      <img class="mL" src="images/cleardot.gif" alt=""> <span class="mG">Reply</span>
                    </div>
                  </td>
                  <td></td>
                  <td>
                    <div class="XymfBd mD" idlink="" tabindex="0" role="button">
                      <img class="mI" src="images/cleardot.gif" alt=""> <span class="mG">Forward</span>
                    </div>
                  </td>
                  <td></td>
                  <td class="io">
                    <div class="adA"></div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ip iq" style="padding: 16px 0;">
              <div id=":18o">
                <table class="cf wS" role="presentation">
                  <tbody>
                    <tr>
                      <td class="amq" style="padding: 0 16px; visibility: hidden; width: 44px;">
                      </td>
                      <td class="amr" style="padding: 0;width: 100%;">
                        <div class="nr wR">
                          <div class="amn" style="display: flex; height: auto; line-height: 20px; padding: 0;">
                          <span id=":1uq" role="link" tabindex="0" class="ams bkH reply">Reply</span>
                            <span id=":1uo" role="link" tabindex="0" class="ams bkG">Forward</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    // Get a reference to the tooltip element
    var tooltip = document.querySelector('.email_tooltip');

    // Get a reference to the hover element
    var hover = document.querySelector('.hover');

    // Add an event listener to the hover element
    hover.addEventListener('mouseover', function() {
      // Show the tooltip element
      tooltip.style.opacity = 1;
      tooltip.style.visibility = 'visible';
      tooltip.style.display = 'block';
    });

    // Add an event listener to the hover element
    hover.addEventListener('mouseout', function() {
      // Hide the tooltip element
      tooltip.style.opacity = 0;
      tooltip.style.visibility = 'hidden';
      tooltip.style.display = 'none';
    });

  // Check email as read if not already
  if (email.read === false){
    fetch(`/emails/${email.id}`, {
      method: "PUT",
      body: JSON.stringify({
        read: true
      })
    })
    .then(response => {
      if (response.status === 204) {
        console.log(`email id:${email.id} is marked as read`)
      }
      else {
        throw new Error("Unknown error during email mark as read attempt")
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  document.querySelectorAll(".reply").forEach(element => {
    // Compose a reply template
    element.addEventListener("click", () => {
      compose_email(email=email);
    })
  })
}

// ------ Archive/Unarchive email ------
function archive_control(email, icon, toArchive) {
  // Update archive/unarchive status
  fetch(`/emails/${email.id}`, {
    method: "PUT",
    body: JSON.stringify({
      archived: toArchive
    })
  })
  .then(response => {
    if (response.status === 204) {
      // Change icon trash->unarchive unarchive->trash
      if (toArchive) {
        icon.parentNode.className = "unarchive-icon"
      }
      else {
        icon.parentNode.className = "archive-icon"
      }
      // Refresh the page
      load_mailbox('inbox');
    }
    else {
      throw new Error("Unknown error during email mark as archived attempt")
    }
  })
  .catch(error => {
    console.log(error)
  })
}