# AI & MBA Leadership Program Landing Page Project

## Project Overview
This project is a high-fidelity landing page for an "AI & MBA Leadership Program" targeting senior software developers transitioning into tech leadership roles. It uses a modern, dark-themed aesthetic with vibrant gradients and interactive elements.

### Technologies
- **HTML5**: Semantic structure.
- **CSS3 (Vanilla)**: Modern styling with CSS variables, Flexbox, Grid, and keyframe animations.
- **JavaScript (Vanilla)**: For interactive features like a dynamic color palette selector, scroll animations (Intersection Observer), and smooth navigation.
- **Font Awesome**: For iconography.

## Directory Overview
The directory contains the content and the final rendered version of the landing page.

### Key Files
- `ai_mba_landing.md`: The source content and structure for the landing page in Markdown format.
- `ai_mba_landing.html`: The complete, single-file implementation of the landing page, including CSS and JavaScript.
- `GEMINI.md`: This instructional context file.

## Usage & Development
The project is a static landing page that can be viewed by opening `ai_mba_landing.html` in any modern web browser.

### Key Features to Maintain
- **Color Palette Selector**: Users can switch between several predefined color schemes (Default, Ocean, Sunset, Vibrant, Purple, Brazilian, Canadian).
- **Responsive Design**: The layout adapts to mobile devices, including a basic mobile navigation toggle.
- **Animations**: Uses Intersection Observer for fade-in effects on scroll and CSS keyframes for floating/pulsing effects.

### Development Conventions
- **Single File Approach**: Currently, all styles and scripts are embedded within the HTML file for simplicity and portability.
- **CSS Variables**: Use the `:root` variables (`--primary`, `--secondary`, etc.) for consistency.
- **Interactive Elements**: Ensure any new sections added are compatible with the `IntersectionObserver` animation logic.
