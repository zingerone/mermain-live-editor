# Mibi Mermaid Pro Editor

A premium, feature-rich live Mermaid diagram editor built with **Go** and **Mermaid.js**. This application provides a seamless experience for creating, managing, and exporting technical diagrams with a modern, developer-centric UI.

## ✨ Features

- **Live Preview**: Real-time rendering of Mermaid syntax as you type.
- **Premium UI**: Sleek dark-mode interface with a flexible split-view layout.
- **Persistence**: Save your diagrams to a local SQLite database, organized by categories.
- **Advanced Export**: Download your creations in multiple formats:
  - **SVG**: Scalable vector graphics.
  - **PNG**: High-resolution raster images.
  - **JPEG**: Web-friendly compressed images with a solid white background.
- **History Management**: Easily browse, load, and delete previous diagrams from the sidebar.

## 🚀 Getting Started

### Prerequisites

- [Go](https://go.dev/doc/install) (version 1.16 or higher recommended)

### Installation & Running

1. **Clone the repository**:
   ```bash
   git clone git@github.com:zingerone/mermain-live-editor.git
   cd mermain-live-editor
   ```

2. **Run the application**:
   ```bash
   go run cmd/app/main.go
   ```

3. **Access the editor**:
   Open your browser and navigate to `http://localhost:8080`.

## 📂 Project Structure

- `cmd/app/main.go`: Application entry point and server configuration.
- `internal/`: Core business logic follows a clean architecture (Delivery, Usecase, Repository).
- `templates/`: HTML templates for the frontend.
- `static/`:
    - `css/`: Modern UI styling.
    - `js/`: Frontend logic (Mermaid initialization, split view, and export logic).
- `diagrams.db`: SQLite database file (ignored by Git).

## 🛠 Tech Stack

- **Backend**: Go (standard library `net/http`)
- **Database**: SQLite
- **Frontend**: Vanilla JavaScript, CSS Variables
- **Libraries**:
    - [Mermaid.js](https://mermaid.js.org/) for diagram rendering.
    - [Split.js](https://split.js.org/) for the resizable layout.

---
Created with ❤️ by zingerone
