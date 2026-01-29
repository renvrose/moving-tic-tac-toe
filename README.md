🎮 Advanced Moving Tic-Tac-Toe

 
📌 Description
Advanced Moving Tic-Tac-Toe is a modern, web-based strategy game that evolves the classic formula. Once players reach their piece limit, the game enters a Movement Phase, during which players slide pieces into adjacent or diagonal slots to win.

This project demonstrates a full DevOps Lifecycle, featuring a high-speed CI/CD pipeline managed via GitHub Actions and containerized with Docker for seamless deployment to Render.

✨ Features
Dynamic Board Scaling: Play on 3x3, 4x4, or 5x5 grids.

Advanced Moving Mechanic: Once the piece limit is reached (e.g., 3 pieces for 3x3), players must move existing pieces to adjacent/diagonal empty cells.

Winning Celebrations: Integrated canvas-confetti for interactive feedback.

Modern UI/UX: Sleek Dark Mode toggle and responsive CSS design.

State Management: Includes an Undo system and Local Storage for player persistence.

🛠 Tech Stack
Frontend: HTML5, CSS3, JavaScript (ES6+)

DevOps: GitHub Actions (CI/CD), Docker (Containerization)

Dev Environment: GitHub Codespaces

Deployment: Render

Version Control: Git & GitHub

🚀 CI/CD Pipeline & Deployment
The project utilizes a cloud-native automation workflow to ensure code quality and rapid deployment.

Pipeline Workflow:
Development: Team uses GitHub Codespaces to maintain a consistent development environment.

Source Control: Developers push code to the main branch.

CI Trigger: GitHub Actions automatically triggers the build and test sequence.

Testing: Automated test cases validate game logic and win conditions.

Containerization: Docker packages the application into a lightweight image to ensure it runs consistently across all environments.

CD Deployment: Upon successful build, the image is deployed to Render via automated webhooks.

▶️ How to Play
Placement Phase: Click empty cells to place your pieces until you reach the board limit.

Movement Phase: * Click one of your existing pieces to select it.

Click an adjacent or diagonal highlighted empty cell to move it.

Win: Align your pieces in a row, column, or diagonal to trigger the confetti!

📦 Installation (Local)

Bash
# Clone the repository
git clone https://github.com/renvrose/moving-tic-tac-toe

# Navigate to the project
cd moving-tic-tac-toe
Alternatively, simply open index.html in any modern browser.

👥 Team Contributions

Version 1.0, Troubleshooting Overall App: Sahana   ( Team Leader)

Test Cases: Li Xuan & Daniel

CI/CD Pipeline (GitHub Actions): Wee Teck

Docker (Git Hub Codespaces) & Docker Render Environment: Sean

Version 2.0 App: Xin Ru

