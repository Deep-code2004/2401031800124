# Virtual Reality Travel Experience

A production-ready web application showcasing immersive VR travel experiences to popular destinations around the world. Built with HTML5, CSS3, JavaScript (ES6+), jQuery, and Bootstrap 5.

![VR Travel Experience Preview](https://images.unsplash.com/photo-1549039725-9c8d1c8d0c82?auto=format&fit=crop&w=1200&q=80)

## 🚀 Features

### Core Features
- **Interactive Destination Cards** - Beautiful, animated cards showcasing Paris, Maldives, and Tokyo
- **Smart Search** - Real-time filtering with debounced input and search result counts
- **VR Tour Modals** - Embedded YouTube videos with detailed descriptions and features
- **Newsletter Subscription** - Email validation and local storage for subscriber management
- **Sorting Options** - Sort destinations by name (A-Z, Z-A) or featured order

### Production-Ready Enhancements
- **PWA Support** - Installable app, offline caching via Service Worker
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards, favicons
- **Accessibility (WCAG 2.1 AA)** - Skip links, ARIA, keyboard nav, reduced motion, high contrast
- **Performance** - Preloads, lazy loading, image fallbacks (95+ Lighthouse score expected)
- **Responsive** - Mobile-first, 6+ destinations grid adapts perfectly
- **Error Handling** - Image fallbacks, global onerror, form validation
- **Dark Mode** - Automatic @prefers-color-scheme support
- **Print Styles** - Optimized for printing key sections

### Production Features Added
- **6 VR Destinations** - Paris, Maldives, Tokyo, NYC, Santorini, Machu Picchu
- **PWA Install Prompt** - beforeinstallprompt handler with toast notification
- **Dynamic Stats** - Destinations count updates automatically
- **Image Fallbacks** - SVG placeholder on load error
- **Service Worker** - Cache-first offline strategy
- **CSP Header** - Content Security Policy meta tag
- **Reduced Motion** - Respects user preference
- **Dark Mode** - Automatic system preference

## 📁 Project Structure

```
wt-assignment-1/
├── Code/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── style.css       # Production stylesheet
│   └── js/
│       └── app.js          # Production JavaScript
├── Figma/
│   └── .gitkeep            # Design files placeholder
├── .gitignore
└── README.md                # Documentation
```

## 🛠️ Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, but recommended)
- Git (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Deep-code2004/2401031800124.git
   cd 2401031800124
   ```

2. **Open with a local server**

   Using Python:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   Using Node.js:
   ```bash
   npx serve
   ```

   Using VS Code:
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **View in browser**
   Navigate to `http://localhost:8000` (or the port shown)

## 🎯 Usage

### For Users

1. **Browse Destinations** - Scroll through featured VR travel destinations
2. **Search** - Type in the search bar to filter destinations by name, subtitle, or description
3. **Sort** - Use the dropdown to sort by name or featured order
4. **Start VR Tour** - Click the button on any card to open the immersive experience modal
5. **Subscribe** - Enter your email to receive updates about new destinations

### For Developers

#### Adding New Destinations

Edit `Code/js/app.js` and add a new object to the `destinations` array:

```javascript
{
    name: "Destination Name",
    subtitle: "Tour Subtitle",
    tagline: "Short catchy description",
    image: "https://example.com/image.jpg",
    description: "Full description for the modal",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    video: "https://www.youtube.com/embed/VIDEO_ID",
    link: "https://maps.google.com/place/DESTINATION"
}
```

#### Customization

**Colors**: Edit CSS custom properties in `style.css`:
```css
:root {
    --color-primary: #4e8cff;
    --bg-dark: #0f2027;
    /* ... */
}
```

**Typography**: Update the Google Fonts import in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

#### Building for Production

1. Minify CSS and JavaScript files
2. Update resource URLs to CDN versions
3. Configure your web server for GZIP compression
4. Set up HTTPS (required for some features)

## 🔧 Technologies Used

### Frontend
- **HTML5** - Semantic markup and accessibility
- **CSS3** - Custom properties, flexbox, grid, animations
- **JavaScript (ES6+)** - Modern syntax and features
- **jQuery 3.7** - DOM manipulation and utilities
- **Bootstrap 5.3** - Responsive framework and components

### External Resources
- **Bootstrap Icons** (via SVG)
- **Google Fonts** - Inter typeface
- **Unsplash** - High-quality images
- **YouTube** - Embedded VR tour videos

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Breakpoints

| Breakpoint | Width | Description |
|------------|-------|-------------|
| Extra Large | ≥1200px | Full desktop layout |
| Large | ≥992px | Large tablets landscape |
| Medium | ≥768px | Tablets portrait |
| Small | ≥576px | Mobile landscape |
| Extra Small | <576px | Mobile portrait |

## ♿ Accessibility Features

- Skip navigation link
- ARIA landmarks and labels
- Keyboard navigable (Tab, Enter, Escape)
- Screen reader friendly
- Reduced motion support
- High contrast mode support
- Focus indicators
- Semantic HTML structure

## 🔒 Browser Storage

The application uses LocalStorage for:
- **Search history** - Remembers last search term
- **Sort preference** - Remembers selected sort option
- **Subscribers** - Stores email addresses (demo purposes)

To clear stored data:
```javascript
localStorage.clear();
```

## 🐛 Troubleshooting

### Common Issues

**Videos not loading?**
- Check internet connection
- Ensure YouTube is not blocked
- Try refreshing the page

**Search not working?**
- Clear browser cache
- Check JavaScript console for errors
- Ensure localStorage is enabled

**Styles not appearing?**
- Clear browser cache
- Check CSS file is linked correctly
- Verify Bootstrap is loaded

## 📄 License

This project is created for educational purposes as part of a Web Technology assignment.

## 👨‍💻 Author

VR Travel Experience Team

## 🙏 Acknowledgments

- Unsplash for beautiful destination images
- YouTube for VR tour content
- Bootstrap team for the framework
- jQuery team for the library

---

**Version 2.0.0** | Last Updated: April 2026
