# Changelog

All notable changes to AcademiQR will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2025-01-XX

### Changed
- Replaced all emojis with Font Awesome icons throughout the application
- Standardized icon button styling to use brand color icons without containers
- Updated trash icons to match appearance tab style (no container, brand color)
- Updated Choose File and Media Library buttons to match trash icon style
- Improved button consistency across all sections

### Added
- Font Awesome icons for delete, remove, edit, file, media library, visibility (globe, lock, key), copy, and drag handle
- Brand color styling for all icons (#1A2F5B)
- Light gray icon styling for selected collections in collection list

### Removed
- Phone emoji from QR code tab
- "QR Code Generator" label from QR tab
- "Analytics" label from analytics tab

## [0.4.4] - 2025-11-13

### Changed
- Version bump to 0.4.4


## [0.4.3] - 2025-11-13

### Changed
- Version bump to 0.4.3


## [0.4.2] - 2025-11-10

### Added
- Dynamic font sizing for display name based on text length
- Minimum font size enforcement (display name never smaller than presentation info)
- Fixed button height (64px) to prevent shrinking with multiple buttons
- Transparent separator line between demographic info and links

### Changed
- Display name font size now scales dynamically (max size for short names, scales down for longer names)
- Button height fixed at 64px with consistent padding
- Separator line between profile and links is now transparent
- Improved button font color application in live preview
- Enhanced border settings persistence on login

### Fixed
- Fixed border settings not being remembered on login
- Fixed button font color not applying correctly in live preview
- Fixed button text element selection to match public site structure
- Fixed `themeToApply` reference error in `updateFormFromTheme` function
- Fixed unit conversion for dynamic font sizing (handles px and rem correctly)
- Fixed button height shrinking when multiple buttons are added


## [0.4.1] - 2025-01-27

### Added
- Google OAuth authentication
- Mobile app icons and favicon support
- Logo display on login page
- Performance optimizations for database queries

### Changed
- Updated tagline to "Amplify your impact"
- Improved login page UI with larger logo
- Optimized Supabase queries to reduce payload size

### Fixed
- Fixed Google OAuth callback handling
- Fixed trigger for user profile creation
- Fixed handle field requirement in profiles table

## [Unreleased]

### Added
- Automated versioning system
- Git repository setup
