# Device card

<!-- drift: src/cards/generic/device/card.ts, src/core/fields-card.ts, src/core/fields.ts -->

Any device of any integration: you choose which sensors and attributes to show. The same `fields` option works on every card of this bundle.

```yaml
type: custom:hoc-device-card
device: <device id>
layout: standard
fields:
  - battery
  - latest_release:name
  - key: temperature
    name: Room
    icon: mdi:thermometer
    color: orange
```

| Option | Default | Description |
|---|---|---|
| `device` | required | Any device. Pick it in the visual editor. |
| `layout` | `standard` | `compact` (icons and values in a row), `standard` (tiles) or `list` (rows) |
| `fields` | the first six sensors | What to show, see below |

## Fields

Each entry is a sensor or one attribute of a sensor:

- `battery` shows the sensor `battery` of the device. The key is the sensor's translation key; sensors without one use their entity id.
- `latest_release:name` shows the attribute `name` of the sensor `latest_release`.

In the visual editor you pick from every sensor and attribute of the device. In YAML an entry can also be an object:

| Key | Description |
|---|---|
| `key` | Sensor key (required) |
| `attribute` | Show this attribute instead of the sensor state |
| `name` | Label override |
| `icon` | Icon override, for example `mdi:star` |
| `color` | A palette name (`blue`, `purple`, `teal`, `orange`, `pink`, `green`, `indigo`, `amber`, or any Home Assistant colour name) or any CSS colour |
| `trend` | Key of another sensor holding a percentage, shown as an arrow |

Name, unit and icon come from Home Assistant. Sensors that are disabled or have no value are left out.

## Colours

Each field gets a stable colour from the palette. Statuses override it with the theme colours: success and failure states (such as CI), overdue or critical counts, and rising or falling trends turn green or red. Colours come from theme variables, so the cards follow your theme, including UI Lovelace Minimalist.
