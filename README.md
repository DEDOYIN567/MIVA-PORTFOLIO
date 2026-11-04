# Adedoyin Adebola Samuel — Portfolio

Multi-page responsive portfolio and academic planner for a full-stack developer: semantic HTML5, CSS custom properties and vanilla JavaScript on the front end, with EmailJS for reminder emails.

## Structure
`index.html` `about.html` `projects.html` `planner.html` `contact.html` · `css/styles.css` · `js/main.js` `js/planner.js` `js/contact.js` · `assets/`

## Run and host
Open `index.html` locally, or push this folder to GitHub and enable Pages (Settings → Pages → deploy from branch). Submit the live link and the repository link.

## Brief checklist
| Requirement | Where |
|---|---|
| Name, photo, welcome, nav, bio | index.html |
| Education, aspirations, skills, hobbies | about.html |
| 3 projects, descriptions, images, links | projects.html |
| Add, complete, delete tasks (JavaScript) | planner.html, js/planner.js |
| Form with empty, email and digits-only checks | contact.html, js/contact.js |
| Semantic HTML, forms, tables, images, links, lists, audio | about.html (table, audio), all pages |
| External CSS, Grid and Flexbox, transitions, responsive | css/styles.css |

## To replace before submitting
1. Photo: `assets/images/portrait.jpeg` is in place. Replace that file to change it.
2. `assets/audio/intro.wav` is a sample tone. Record the transcript from about.html and replace it.
3. Add education details and hobbies in about.html; re-take the project screenshots (assets/images/p1-p3.jpg) if you change the design. The planner screenshot uses sample tasks.
4. The contact form sends email through Formspree. The form link is `ENDPOINT` at the top of `js/contact.js`. Send one real test message after deploying.

## Testing log
Syntax-checked only. Run the browser tests and record results here.

## Email reminders (planner)
- "Email" on a task and "Email me my open tasks" open a prefilled Gmail draft addressed to the email you enter. You review and press Send. The site cannot send email by itself; scheduled automatic emails would need a service such as EmailJS or Formspree plus a real end-to-end test.
- "Calendar" downloads an .ics file with an alert at 9:00 the day before the due date.

## Planner statuses
Each task moves through To do, In progress, Review and Done. The checkbox and the status menu stay in sync, and older saved tasks are upgraded automatically.

## Reminder emails to each visitor (EmailJS)
The planner's Email buttons send a reminder to whatever address the visitor types in. Until you add your keys, they open a Gmail draft instead.
1. Create a free account at emailjs.com.
2. Email Services: add a service (for example Gmail) and copy its Service ID.
3. Email Templates: create a template with To Email `{{to_email}}`, Subject `{{subject}}` and content `{{message}}`. Add this footer: "You received this because this address was entered in the academic planner on Adedoyin Adebola Samuel's portfolio. If this was not you, ignore this email." Copy the Template ID.
4. Account: copy the Public Key.
5. Paste the three values into `EMAILJS` at the top of `js/planner.js`, save and redeploy.
6. In EmailJS, switch on any domain restriction and usage limit it offers, then send a test to your own address and check spam.
Notes: the public key is meant to be visible. The free plan has a monthly email cap and a limit of one request per second. Visitors' addresses and task text pass through EmailJS, and the planner says so beside the email box.

## Latest additions
- Projects page: three live projects (AI Email Threat Detection System, Green Haven Plant Shop, Thrift Store Platform) with category filter and search, plus a "More work" list. The old p1-p3 screenshots were removed.
- Background: blue drifting light and two lightning bolts (dark mode). In `css/styles.css`, set `--fx:0` to switch all effects off.
- Social icons: GitHub, LinkedIn and Contact are live. Instagram and Facebook are added back once their profile links are set (find the `<nav class="social">` block in each page's footer).
- Home page: Tech stack is now a clean profile strip plus five rectangular cards, including Flutter, Dart and Go. Site index is now four cards.
- Background: deep-blue storm with drifting light and two lightning bolts. In light mode the same storm shows softly in deeper blue (`--pk` sets bolt strength, `--fx` the drifting light; `--fx:0` switches all effects off).
- Planner: longer guidance text and a "How the planner works" section.
- Projects page: the AI Email Threat Detection System now uses a real screenshot of the live app (assets/images/skills/email-detector.jpg).
