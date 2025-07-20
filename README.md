# Shree Bhagwad Gita Wisdom

A modern, responsive web application for exploring the divine wisdom of the Bhagavad Gita through 701 sacred verses with Sanskrit, transliteration, and detailed meanings.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/shree-bhagwad-gita-wisdom)

## ✨ Features

- **701 Complete Verses**: All chapters and verses from the Bhagavad Gita
- **Multi-language Support**: Sanskrit, transliteration, Hindi, and English
- **Voice Synthesis**: Listen to Sanskrit verses with browser voice technology
- **Multiple Themes**: Wine, Lotus, and Grey theme options
- **Responsive Design**: Optimized for desktop and mobile devices
- **Search Functionality**: Find verses by content across all languages
- **Auto-advance**: Configurable automatic verse progression
- **Accessibility**: Full keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **API**: Vercel Serverless Functions
- **Data**: CSV-based storage for fast loading
- **Security**: Rate limiting, input sanitization, CSP headers

## 📦 Local Development

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd shree-bhagwad-gita-wisdom-production
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🌐 Deployment

### Automatic Deployment (Recommended)

1. **Fork this repository**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository
   - Deploy automatically

### Manual Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

## 🔧 Configuration

The application works out of the box with no additional configuration required. All data is included in the repository.

### Optional Environment Variables

Create a `.env.local` file for customization:

```env
# Optional: Custom domain for API calls
VERCEL_URL=https://your-domain.vercel.app
```

## 🔒 Security Features

- **Rate Limiting**: 25 requests per minute per IP
- **Input Sanitization**: XSS protection for all user inputs
- **Security Headers**: CSP, XSS protection, frame options
- **Content Validation**: Server-side validation for all parameters

## 📁 Project Structure

```
shree-bhagwad-gita-wisdom-production/
├── api/                    # Vercel serverless functions
│   └── verses/            # Verse API endpoints
├── src/                   # React frontend source
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── pages/            # Page components
├── attached_assets/       # CSV data and static assets
├── vercel.json           # Vercel configuration
└── vite.config.ts        # Vite configuration
```

## 🎯 API Endpoints

- `GET /api/verses` - Get all verses (paginated)
- `GET /api/verses/random` - Get a random verse
- `GET /api/verses?q=search` - Search verses
- `GET /api/verses?chapter=1&verse=1` - Get specific verse

## 🎨 Themes

The application includes three beautiful themes:
- **Wine**: Deep red and gold colors
- **Lotus**: Soft pink and white colors  
- **Grey**: Modern monochrome design

## 🔊 Voice Features

- **Multi-language Voice**: Supports Sanskrit, Hindi, and English
- **Playback Controls**: Play, pause, stop functionality
- **Sanskrit Pausing**: Automatic pauses between verse lines
- **Mobile Optimized**: Works on iOS and Android browsers

## 📱 Progressive Web App

The application is PWA-ready with:
- Offline capability
- Install to home screen
- Fast loading with caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Verse data sourced from authentic Sanskrit manuscripts
- Built with modern web technologies for optimal performance
- Designed for spiritual seekers and Sanskrit scholars

---

**Experience the timeless wisdom of the Bhagavad Gita in a modern, accessible format.**

🕉️ **Om Shanti Shanti Shanti** 🕉️