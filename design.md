# OffBeat Pravasi Design System

This design system is based on the provided visual reference: soft neutral surfaces, rounded panels, deep outdoor green, confident journey blue, and a warm action orange. The app should feel calm, modern, and travel-ready without becoming overly decorative.

## Brand Mood

- Grounded and outdoors-first.
- Clean cards on warm neutral backgrounds.
- High-contrast green for primary actions and selected navigation.
- Blue for secondary discovery or informational states.
- Orange for energetic highlights, warnings, and trip moments.

## Color Tokens

| Token | Hex | Usage |
| --- | --- | --- |
| Primary | `#1B5E20` | Main CTA, selected tab, active filters, success state |
| Secondary | `#1565C0` | Discovery actions, links, informational badges |
| Tertiary | `#FF7043` | Highlights, promotional chips, warm accents |
| Neutral | `#FAFAFA` | App background and quiet cards |
| Ink | `#151716` | Primary text |
| Sage | `#3F4A3F` | Muted brand text |

## Type

- Headline: Plus Jakarta Sans style, strong and geometric.
- Body: Manrope style, readable and compact.
- Label: Manrope style, medium weight, short and clear.

The app currently maps these to platform-safe font stacks through `src/theme/theme-manager.ts`. Add bundled font loading later if exact brand fonts are required on native devices.

## Shape And Spacing

- Cards: 20px radius, 1px neutral border.
- Pills and buttons: fully rounded.
- Compact content spacing: 8px to 16px.
- Screen padding: 20px horizontal, 18px vertical.

## Component Rules

- Primary buttons use green background and white text.
- Secondary buttons use blue only when the action is discoverable or navigation-like.
- Outlined buttons use neutral borders and ink text.
- Cards should use neutral surfaces, not saturated fills.
- Tab selection uses primary green; inactive icons stay muted.
- Avoid large gradients and decorative blobs; use color through functional controls, badges, and accents.

## Implementation

- Token source: `src/theme/theme.json`
- Theme runtime: `src/theme/theme-manager.ts`
- Legacy compatibility: `src/constants/theme.ts`
- NativeWind aliases: `tailwind.config.js`
- NativeWind CSS input: `src/global.css`
