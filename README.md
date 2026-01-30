# 📄 ResumeFlow

A modern, AI-powered resume builder that helps you create professional resumes with customizable templates and intelligent content generation.

## ✨ Features

- **🎨 Professional Templates**: Choose from modern and minimal resume templates
- **🤖 AI-Powered Content**: Generate professional summaries using Google Gemini AI
- **🎨 Customizable Design**: Adjust accent colors and styling to match your brand
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices
- **💾 Local Storage**: Your data stays private and secure on your device
- **🖨️ Print & Export**: Easy PDF export and printing capabilities
- **⚡ Real-time Preview**: See your changes instantly with live preview
- **🔄 Auto-save**: Never lose your work with automatic saving

## 🚀 Live Demo

[Visit ResumeFlow](https://your-demo-url.vercel.app)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for lightweight routing
- **TailwindCSS** for styling
- **Radix UI** for accessible components
- **Framer Motion** & **GSAP** for animations
- **React Hook Form** with Zod validation
- **TanStack Query** for state management

### Backend
- **Vercel Functions** for serverless API
- **Google Gemini AI** for content generation
- **Local Storage** for data persistence

### Development Tools
- **Vite** for fast development and building
- **TypeScript** for type safety
- **ESLint** & **Prettier** for code quality

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resumeflow.git
   cd resumeflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 How to Use

### Creating Your First Resume

1. **Start Fresh**: Click "Create New Resume" on the dashboard
2. **Choose Template**: Select from available professional templates
3. **Fill Information**: Add your personal details, work experience, education, and skills
4. **AI Summary**: Use the AI-powered summary generator for professional descriptions
5. **Customize**: Adjust colors and styling to match your preferences
6. **Export**: Print or save as PDF when ready

### Template Options

- **Modern Template**: Clean sidebar design with accent colors
- **Minimal Template**: Simple, traditional layout focused on content

## 🔧 Configuration

### Templates
Templates are located in `client/src/components/TemplatePreview.tsx`. Each template is a React component that receives resume content and styling props.

### Styling
The project uses TailwindCSS with custom font configurations:
- **Display**: Outfit font family
- **Body**: DM Sans font family  
- **Mono**: JetBrains Mono font family

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Set environment variables** in Vercel dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Other Platforms

The app can be deployed to any static hosting platform:
1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Configure environment variables for API functions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://radix-ui.com/) for accessible component primitives
- [TailwindCSS](https://tailwindcss.com/) for utility-first CSS framework
- [Google Gemini AI](https://ai.google.dev/) for AI-powered content generation
- [Lucide React](https://lucide.dev/) for beautiful icons

## 📬 Support

If you have any questions or need help:

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/resumeflow/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/resumeflow/discussions)

---

Made with ❤️ by [Your Name](https://github.com/yourusername)