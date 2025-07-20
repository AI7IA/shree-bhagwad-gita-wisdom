# Deployment Guide - Shree Bhagwad Gita Wisdom

## 🚀 One-Click Deployment to Vercel

### Method 1: Deploy Button (Easiest)
Click the deploy button in README.md for instant deployment.

### Method 2: GitHub Integration
1. **Fork or Upload**: Fork this repository or upload to your GitHub
2. **Connect Vercel**: Go to [vercel.com](https://vercel.com) and connect your GitHub
3. **Import Project**: Select your repository and click "Import"
4. **Deploy**: Vercel will automatically detect the configuration and deploy

### Method 3: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod
```

## 📋 Pre-Deployment Checklist

- ✅ All source files copied to production folder
- ✅ API functions configured for Vercel serverless
- ✅ Security headers implemented
- ✅ Rate limiting configured
- ✅ CSV data included in attached_assets
- ✅ Production build optimized

## 🔧 Configuration Files

### vercel.json
Pre-configured with:
- Serverless functions for API routes
- Security headers
- Proper routing for SPA
- Static asset serving

### package.json
Optimized with:
- Production dependencies only
- Proper build scripts
- Node.js 18+ requirement

## 🌐 Post-Deployment

### 1. Verify Deployment
After deployment, test these URLs:
- `https://your-app.vercel.app/` - Homepage
- `https://your-app.vercel.app/api/verses/random` - API test
- `https://your-app.vercel.app/attached_assets/Bhagwad_Gita.csv` - Data access

### 2. Custom Domain (Optional)
1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 3. Environment Variables (Optional)
If needed, add in Vercel dashboard → Settings → Environment Variables:
- `VERCEL_URL`: Your custom domain
- Any analytics or tracking IDs

## 🔒 Security Configuration

### Automatic Security Features
- ✅ Rate limiting (25 req/min)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Input sanitization
- ✅ Security headers

### Manual Security Steps
1. **Custom Domain**: Use HTTPS (automatic with Vercel)
2. **Monitoring**: Set up Vercel analytics
3. **Alerts**: Configure error monitoring

## ⚡ Performance Optimization

### Included Optimizations
- **Code Splitting**: Vendor, UI, and query chunks
- **Tree Shaking**: Unused code elimination
- **Minification**: Terser optimization
- **Compression**: Gzip/Brotli enabled
- **CDN**: Global edge network
- **Caching**: Static asset caching

### Performance Metrics
Expected Lighthouse scores:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 95+

## 📊 Monitoring & Analytics

### Built-in Monitoring
- Vercel Analytics (optional)
- Error tracking
- Performance monitoring
- Real User Metrics (RUM)

### Custom Analytics
Add to environment variables:
```env
NEXT_PUBLIC_GA_ID=your_google_analytics_id
VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Errors**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules dist
   npm install
   npm run build
   ```

2. **API Not Working**:
   - Check `attached_assets/Bhagwad_Gita.csv` exists
   - Verify API routes in `api/verses/` folder
   - Check Vercel function logs

3. **Assets Not Loading**:
   - Verify `attached_assets` folder structure
   - Check vercel.json rewrites configuration

4. **Performance Issues**:
   - Enable Vercel Analytics
   - Check bundle size with `npm run build`
   - Optimize images and fonts

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## 🔄 Updates & Maintenance

### Updating the Application
1. Make changes to source code
2. Push to GitHub (if using GitHub integration)
3. Vercel automatically redeploys
4. Or run `vercel --prod` for CLI deployment

### Data Updates
To update verse data:
1. Replace `attached_assets/Bhagwad_Gita.csv`
2. Redeploy the application
3. Data will be automatically loaded

## 📈 Scaling Considerations

### Vercel Limits (Hobby Plan)
- 100GB bandwidth/month
- 6,000 build minutes/month
- 10 deployments/day
- Serverless function timeout: 10s

### Upgrade Path
For high traffic:
1. Upgrade to Vercel Pro
2. Implement database caching
3. Add Redis for rate limiting
4. Consider CDN for assets

---

## 🎉 Deployment Complete!

Your Shree Bhagwad Gita Wisdom application is now live and accessible worldwide. The spiritual wisdom of the Bhagavad Gita is now just a click away for users around the globe.

**May this application serve as a bridge to ancient wisdom in the modern digital age.** 🕉️