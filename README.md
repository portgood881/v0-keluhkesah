# Keluh Kesah

[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=fff)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](#)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?style=flat-square&logo=shadcnui&logoColor=fff)](#)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](#)
[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=flat-square&logo=vercel&logoColor=white)](#)
[![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?style=flat-square&logo=postgresql&logoColor=white)](#)
[![Bun](https://img.shields.io/badge/Bun-orange?style=flat-square&logo=bun&logoColor=white)](#)

![Logo](public/keluhkesah.png)

> Tempat berkeluh kesah secara anonim

**Keluh Kesah** is an anonymous platform where users can freely express themselves and share their thoughts. The goal is to create a safe space for people to vent, share experiences, and hopefully reduce stress.

---

## ✨ Features

- **Infinite Scrolling**: Load posts dynamically as you scroll for a smooth browsing experience.
- **Rate Limiting and Cooldowns**: Prevent spam and abuse with rate limiting and cooldown periods.
- **Bad Words Filtering**: Automatically filter out inappropriate language to maintain a respectful community.
- **Anonymous Sharing**: Share your thoughts and feelings without revealing your identity.
- **Safe Space**: A supportive environment for open expression.

---


## 🌐 Live Demo

Check out the live demo here: [https://keluhkesah.vercel.app](https://keluhkesah.vercel.app)

---

## 🚀 Getting Started

To get started with the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ifalfahri/keluh-kesah.git
   cd keluh-kesah
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```
   or
    ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your environment variables:
   ```env
   DATABASE_URL="your_database_url_here"
   ```

4. **Set up Prisma:**
    ``` bash
    bunx prisma migrate dev
    ```
   or
    ``` bash
    npx prisma migrate dev
    ```


5. **Run the development server**:
   ```bash
   bun run dev
   ```
   or
    ```bash
   npm run dev
   ```

6. **Open your browser**:
   Visit `http://localhost:3000` to view the application.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, feel free to fork the repository, create a new branch, and submit a pull request.

---

## 📜 License

This project is licensed under the GNU GPL 3.0 License. See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Ifal Fahri A](https://ifal.me)