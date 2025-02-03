# LootFinder

LootFinder is a web application designed to help users find and sell cheap items ("loots") in their local area. Buyers can browse a map to discover nearby deals, while sellers can list items they want to sell.

## App Type and Tech Stack

**App Type:** Location-based web application  
**Tech Stack:** Vite, Vue.js, Firebase, Vercel

We chose this stack because it’s simple and gets the job done. Vite is fast for development, Vue.js makes building the UI easy, Firebase handles the backend like auth and data storage, and Vercel simplifies deployment.

## About LootFinder

LootFinder connects local buyers and sellers by showcasing available "loots" on an interactive map. Buyers can explore items based on proximity and decide if they want to purchase, while sellers can easily list their items with details and prices. The app ensures quick, local transactions and provides a simple, user-friendly experience.

### User Roles and Permissions

1. **Buyer**:

   - View available items on a map.
   - Filter and search for specific items.
   - Contact sellers through the platform.
   - Mark items as purchased.

2. **Seller**:

   - Create new listings with descriptions, images, and prices.
   - View and manage their active listings.
   - Receive and respond to buyer inquiries.
   - Mark items as sold.

3. **Admin**:
   - Monitor user activity.
   - Delete inappropriate or flagged listings.
   - Manage user accounts and permissions.

## Installation

To get started with LootFinder, follow these steps:

### Prerequisites

- Ensure you have Node.js installed.

Clone the repository and navigate to the project directory:

```
git clone https://github.com/ucsb-cs148-w25/pj14-lootfinder.git
cd LootFinder
```

Install the necessary dependencies:

```
npm install
```

### Core Dependencies

- **Vue** (`^3.5.13`): The progressive JavaScript framework used for building the user interface.
- **Vue Router** (`^4.5.0`): Enables client-side routing for seamless navigation without full page reloads.
- **Tailwind CSS** (`^4.0.0`): A utility-first CSS framework for quickly creating custom designs.
- **@tailwindcss/vite** (`^4.0.0`): Integrates Tailwind with the Vite build tool for fast development.
- **Firebase** (`^11.2.0`): Provides serverless backend services (authentication, database, hosting).
- **VueFire** (`^3.2.1`): Simplifies Firebase integration and real-time data binding in Vue.

### Running the App Locally

- Start the development server:

```
npm run dev
```

- Visit localhost

### Accessing Deployment

- Visit our website with this link: [LootFinder](https://lootfinder.vercel.app/)

### Functionality

- You can navigate the app using the navigation bar at the top of the website
- Offers can be posted by clicking "Create Offer"
- Offers can be viewed on the "Browser Offers" page
- Your offers can be modified by clicking "My Offers"
- Profile details can be viewed by clicking on your profile picture in the top right

### Known Problems

- The landing page is not centered
- The footer is not at the very bottom of the landing page

## Features (Planned)

- **Map Integration**: Displays all "loots" on a map with real-time updates.
- **User Profiles**: Separate dashboards for buyers and sellers.
- **Search & Filters**: Allow buyers to refine their searches.
- **Secure Communication**: Messaging system for buyers and sellers.
- **Role-Based Permissions**: Admins can moderate content and manage users.
