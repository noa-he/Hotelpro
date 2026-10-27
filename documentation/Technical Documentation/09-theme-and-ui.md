# 9. Theme and UI

The look of HotelPro is Bootstrap 5 with a custom colour theme layered on top. The theme is a single stylesheet, `client/src/theme.css`, imported **after** Bootstrap in `main.jsx` so its rules override Bootstrap's defaults.

```js
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css';
```

## Palette

| Token | Value | Use |
|-------|-------|-----|
| `--brand-1` | `#4f46e5` (indigo) | Primary colour, links, buttons |
| `--brand-2` | `#7c3aed` (violet) | Gradient partner |
| `--brand-3` | `#ec4899` (pink) | Gradient end |
| `--accent` | `#f59e0b` (amber) | Search panel top border, highlights |

The theme also sets Bootstrap's `--bs-primary` and link colours to the brand indigo.

The page background is a soft vertical gradient from indigo-tint to violet-tint to peach (`#eef2ff` → `#faf5ff` → `#fff7ed`), fixed while scrolling.

## Colour by room type

Each room type has its own colour, set through a CSS custom property `--type`:

| Type | Class | Colour |
|------|-------|--------|
| Single | `.type-single` | Teal `#0f766e` |
| Double | `.type-double` | Blue `#1d4ed8` |
| Deluxe | `.type-deluxe` | Purple `#6d28d9` |
| Suite | `.type-suite` | Crimson `#be123c` |

The room card gets `type-<type>` as a class, and its top border, type badge and price all read `var(--type)`. On the booking page, the badge next to the room title uses the same classes.

## Style classes

| Class | Where used | Look |
|-------|-----------|------|
| `.app-navbar` | `Navbar` | Indigo → violet → pink gradient with soft shadow. Active link turns pale yellow. |
| `.hero` | `RoomList` heading banner | Gradient banner with two decorative translucent circles |
| `.filters-card` | `RoomList` search form | Amber top border, rounded corners |
| `.room-card` | `RoomList` cards | Coloured top border, lifts up on hover |
| `.type-badge` | Room type badge | Background from `--type` |
| `.price-tag` | Room price | Text colour from `--type` |
| `.btn-brand` | "Book this room" | Outlined indigo, fills with gradient on hover |
| `.btn-dark` / `.btn-outline-dark` | Primary buttons | Restyled to the indigo-violet gradient and indigo outline |
| `.stat-card` | `Dashboard` summary cards | Coloured top border per card (amber, indigo, green, pink) |
| `.table-light` | Dashboard table header | Pale indigo background |
| `.badge.rounded-pill.text-bg-light` | Amenity chips | Pale indigo chips |

## Component changes in this update

| File | Change |
|------|--------|
| `main.jsx` | Imports `theme.css` |
| `Navbar.jsx` | `bg-dark` replaced by `app-navbar` |
| `RoomList.jsx` | New hero banner ("Find your perfect stay"), `filters-card`, `room-card` with `type-<type>`, `type-badge`, `price-tag`, and `btn-brand` |
| `BookingForm.jsx` | Room type badge uses `type-badge type-<type>` |
| `Dashboard.jsx` | Summary cards get `stat-card` |
| `vercel.json` | New. See [10-deployment.md](10-deployment.md). |

No component logic changed. The update is purely visual.

## Customising the theme

- **Change the brand colours:** edit the four variables at the top of `theme.css`. The gradients in `.app-navbar`, `.hero` and the buttons are written with literal colours too, so search for `#4f46e5`, `#7c3aed` and `#ec4899` and update them together.
- **Change a room-type colour:** edit its `--type` value in the `.type-*` rules.
- **Add a room type:** add the type to the Room model enum and `RoomList`'s `TYPES` array, then add a matching `.type-<name> { --type: ... }` rule.

## Implementation note

Two dashboard rules use `:nth-child` on `.col-6` to colour the four stat cards in order. If the card layout changes, those selectors may need updating.
