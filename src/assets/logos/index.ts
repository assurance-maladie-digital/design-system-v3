// Barrel centralisant les URLs des logos.
// Chaque SVG n'est ainsi importé (et émis par vite-plugin-lib-assets) qu'une
// seule fois, même s'il est utilisé par plusieurs composants. Cela évite les
// avertissements Rollup « overwrites a previously emitted file of the same name ».
import logoDesktop from './logo-desktop.svg'
import logoMobile from './logo-mobile.svg'
import logoDesktopWhite from './logo-desktop-white.svg'
import logoMobileWhite from './logo-mobile-white.svg'

export { logoDesktop, logoMobile, logoDesktopWhite, logoMobileWhite }
