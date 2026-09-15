CellSim Live

[My Notes](notes.md)

CellSim Live is a real-time, two-player simulation of the human body's fight to stay in balance.

### Elevator pitch

CellSim Live is a real-time, two-player simulation of the human body's internal balance. One player defends it as the "Balance Keeper," boosting immunity and repairing tissue. The other attacks as the "Invader," releasing pathogens and toxins. A simple rule-based engine drives every cell on the grid in real time, so no two matches play out the same way. It's Conway's Game of Life meets a live immunology experiment.

### Design

![Main menu](login.png)
![Main dashboard](Main.png)
![Balance vs Chaos mode](BalanceVsChaos.png)

A control panel on one side sets the starting cell populations; a live grid on the other shows the tissue sample evolving. In "Balance vs. Crisis" mode, a Homeostasis meter and countdown timer sit up top, and each player gets two action buttons.

### Key features

- Set starting cell populations and watch the tissue evolve live
- Two-player "Balance vs. Crisis" mode with a countdown timer
- Save configurations and compete on a fastest-recovery leaderboard
- Auto-generated specimen names and facts from a third-party API

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - The login/menu page and the main simulation dashboard.
- **CSS** - Responsive layout with visual states tied to the Homeostasis Level.
- **React** - Component-based UI (grid, sliders, meter, leaderboard) that re-renders from WebSocket updates; routes between menu, lobby, and simulation.
- **Service** - Endpoints for rooms, saves, leaderboard, and login/logout; calls a third-party API (TBD from the public APIs list) for specimen names/facts.
- **DB/Login** - Stores accounts, saved configurations, and the leaderboard.
- **WebSocket** - Broadcasts the live grid state and both players' actions in real time.


## 🚀 Specification Deliverable

> [!NOTE]
> Fill in this sections as the submission artifact for this deliverable. You can refer to this [example](https://github.com/webprogramming260/startup-example/blob/main/README.md) for inspiration.

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] I completed the prerequisites for this deliverable (Git commit requirement)
- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology including your 3rd party API and use of WebSocket
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Rented EC2 server** - Launched a t3.micro Ubuntu 26.04 LTS EC2 instance in us-east-2 (Ohio), installed Caddy as the web server.
- [x] **Leased domain name** -Registered `start-up-dingxi.click` through Route 53.
- [x] **Server accessible** from my domain: [https://startup.start-up-dingxi.click](https://startup.start-up-dingxi.click) — Configured a Route 53 A record pointing the domain at my EC2 instance's public IP, and edited the Caddyfile to enable automatic HTTPS via Let's Encrypt.

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **HTML pages** - I did not complete this part of the deliverable.
- [ ] **Proper HTML element usage** - I did not complete this part of the deliverable.
- [ ] **Links** - I did not complete this part of the deliverable.
- [ ] **Text** - I did not complete this part of the deliverable.
- [ ] **3rd party API placeholder** - I did not complete this part of the deliverable.
- [ ] **Images** - I did not complete this part of the deliverable.
- [ ] **Login placeholder** - I did not complete this part of the deliverable.
- [ ] **DB data placeholder** - I did not complete this part of the deliverable.
- [ ] **WebSocket placeholder** - I did not complete this part of the deliverable.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **Visually appealing colors and layout. No overflowing elements.** - I did not complete this part of the deliverable.
- [ ] **Use of a CSS framework** - I did not complete this part of the deliverable.
- [ ] **All visual elements styled using CSS** - I did not complete this part of the deliverable.
- [ ] **Responsive to window resizing using flexbox and/or grid display** - I did not complete this part of the deliverable.
- [ ] **Use of a imported font** - I did not complete this part of the deliverable.
- [ ] **Use of different types of selectors including element, class, ID, and pseudo selectors** - I did not complete this part of the deliverable.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **Bundled using Vite** - I did not complete this part of the deliverable.
- [ ] **Components** - I did not complete this part of the deliverable.
- [ ] **Router** - I did not complete this part of the deliverable.

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.
- [ ] **Supports registration, login, logout, and restricted endpoint** - I did not complete this part of the deliverable.
- [ ] **Uses BCrypt to hash passwords** - I did not complete this part of the deliverable.

## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
