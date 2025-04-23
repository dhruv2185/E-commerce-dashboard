# 📊 E-commerce Sales Dashboard

## Overview

This project is a dynamic, interactive sales data dashboard built using **React**, **Next.js**, and **D3.js**. It features multiple chart types and allows users to filter data by year. The charts are animated and responsive, offering a polished user experience for exploring key sales metrics.

## Features

- 📈 **Bar Chart** – Displays sales data by category  
- 📉 **Line Chart** – Visualizes monthly sales trends  
- ⚪ **Scatter Plot** – Compares product price vs rating  
- 🗂️ **Year Filter** – Interactive dropdown to switch datasets by year  
- 🛠️ **Tooltips** – Hover effects show detailed information  
- ✨ **Animations** – Smooth transitions between datasets using Framer Motion  
- 📱 **Responsive Design** – Charts adjust on window resize

## Tech Stack

- **React** & **Next.js** – Frontend architecture  
- **D3.js** – Data-driven visualizations  
- **Framer Motion** – UI animations  
- **Tailwind CSS** – Utility-first styling  
- **shadcn/ui** – Prebuilt UI components  
- **ESLint**, **Prettier**, **Husky** – Code quality and formatting

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/d3-sales-dashboard.git
cd d3-sales-dashboard

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Available Scripts

- `pnpm dev` – Start the local development server  
- `pnpm build` – Build the project for production  
- `pnpm lint` – Run ESLint checks  
- `pnpm format` – Format code using Prettier  
- `pnpm prepare` – Setup Git hooks with Husky

## Challenges

Integrating D3.js with React presented several challenges due to D3’s imperative approach to DOM manipulation, which conflicts with React’s declarative model. This was resolved using `useRef` and `useEffect` to safely bridge the two.

Responsive design required dynamically recalculating chart dimensions and margins on resize events. Implementing smooth animations also demanded careful coordination between D3 transitions and React's rendering cycle.

## Future Enhancements

- Support for additional chart types (e.g., pie, radar)  
- Advanced filter options (e.g., product category, region)  
- Dark mode support  
- Unit and integration tests  

## Learning Outcomes

This project deepened my understanding of **data visualization** principles, responsive design, and how to effectively integrate **D3.js** with **React**. It also strengthened my skills in animation and frontend tooling.
