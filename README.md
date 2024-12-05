# Next.js Offline-First Background Sync Test

This project is a simple Next.js application that demonstrates offline-first capabilities. Users can input and submit a list of items. When the user is offline, the data is saved in `localStorage`. Once the user is back online, the data is transferred to `IndexedDB` and cleared from `localStorage`.

---

## Features

- Add items to a list via an input form.
- Offline-first functionality:
  - Saves data in `localStorage` when offline.
  - Syncs data to `IndexedDB` when the user goes back online.
  - Clears `localStorage` after syncing to `IndexedDB`.

---

## Project Structure

```
kala_bazar/
|-- src/
    |-- app/
        |-- page.tsx  // Main app View
    |-- utils/
        |-- indexeddb.js // Utility functions for IndexedDB
        |--  register_service_worlker.tsx // registering service worker
        |--  use_input.tsx // state and methods for handling input
        |--  use_navigator_online.tsx // a listener for changing user internet availibility
|-- public/
|   |-- sw.js     // Service Worker for offline handling

|-- utils/
|   |-- indexedDB.js // Utility functions for IndexedDB
|-- styles/
|-- package.json
|-- README.md
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>= 20.x.x)
- npm (comes with Node.js) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ir-tec/background-sync-test.git
   cd kala_bazar
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open the application in your browser:
   ```
   http://localhost:3000
   ```

---

## Usage

### Adding Items

1. Enter text into the input field.
2. Press the **Save** button.
3. The item is added to the list.

### Offline Behavior

- If the browser is offline, items will be stored in `localStorage`.
- When the browser comes back online, the service worker:
  - Transfers the data to `IndexedDB`.
  - Clears `localStorage`.

### Syncing to IndexedDB

Data stored offline is automatically synced to `IndexedDB` when the user regains connectivity.

---

## Technology Stack

- **Next.js**: React-based framework for building web applications.
- **localStorage**: Simple offline storage for browsers.
- **IndexedDB**: High-performance database for offline data storage.
- **Service Workers**: Enables offline-first behavior.

---

## Scripts

- **Start Development Server**:
  ```bash
  npm run dev
  ```
- **Build Production Version**:
  ```bash
  npm run build
  ```
- **Start Production Server**:
  ```bash
  npm start
  ```

---

## Notes

1. The application uses a service worker to monitor connectivity changes and simulate the process when the user gets packonline but beacuse all this process is in browser we don't have any task there to handle synchronization. 
2. IndexedDB operations are handled asynchronously. Utilities in `utils/indexedDB.js` simplify working with it.

---


## License

This project is licensed under the [MIT License](LICENSE).
