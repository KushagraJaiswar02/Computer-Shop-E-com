# Future feature proposal: PC component builder

## Goal and boundary

Build a guided configuration tool that assembles a list from the live product catalog and reports compatibility from structured, versioned evidence. The current catalog uses mostly display-oriented `attributes` name/value pairs and does not include the normalized socket, memory, dimensions, power, connector or firmware data needed to validate builds. Therefore this feature is proposed only; the storefront must not claim that current products are compatible.

## Minimum viable experience

1. Start with a build and choose a CPU, motherboard, memory, graphics card, storage, PSU, case and cooler. Allow a component to be left unselected.
2. Each selector searches only purchasable catalog records and shows current price, availability and the exact relevant specifications.
3. Revalidate the whole build when a component changes. Show `compatible`, `incompatible`, or `needs review`, with a human-readable reason and a link to the affected component.
4. Add all currently available components to cart as one build group only after the server rechecks price, stock and compatibility. No order or payment should be implied by saving a build.
5. Save/share builds only after account or guest-session persistence and privacy behavior are designed.

## Structured product data to add

Keep merchandising copy separate from machine-readable specifications. A typed specification object should be present on the catalog API response and have units/enums that can be validated:

- CPU: socket, supported memory type/speeds, power limits, included cooler status.
- Motherboard: CPU socket, chipset, board form factor, memory type, DIMM count, maximum memory, supported memory profiles/speeds, BIOS CPU support/minimum version, PCIe slots and M.2/SATA slots.
- Memory: memory type, module count, capacity per module, rated speed, profile support, physical height if clearance is modeled.
- GPU: board length, height/thickness/slot width, recommended system power, board power, power connector types/count, interface.
- Case: motherboard form factors, GPU maximum length, CPU cooler maximum height, radiator mount positions and sizes, PSU form factor/length clearance, drive bays.
- PSU: continuous rated output, connector type/count, PSU form factor and length.
- Cooler: supported sockets, cooler height or radiator size, mounting requirements, thermal capacity when the manufacturer publishes a useful rating.
- Storage: interface, form factor, keying/protocol and required motherboard connector.

Every value needs a source (manufacturer specification or verified data provider), source URL/reference, last-checked date, and review status. Unknown values must remain unknown rather than guessed. Compatibility rules must be versioned and testable.

## Validation model

Use deterministic hard checks where data is complete: CPU socket and explicit board CPU/BIOS support; RAM type, board capacity and slot count; case form-factor support; GPU physical clearance and slot count; cooler socket/mount and case clearance; PSU output headroom and required connectors; and storage interface/slot availability. Show an unknown-data warning when a required field is missing. Treat performance balance, acoustics, physical cable routing and other non-binary judgments as guidance, not a pass/fail compatibility promise.

The server is the authority. A client-side validator may provide fast feedback using the same versioned rule definitions, but checkout must re-run validation against current catalog and inventory data. Record the catalog/rule versions used for each saved build so changed data can invalidate and explain an earlier result.

## Rollout

1. Audit the retailer's catalog source and agree on field definitions, units, authoritative references and data ownership.
2. Normalize specifications for a small curated CPU/motherboard/memory set; reject or mark incomplete data rather than inferring it from product titles.
3. Implement the validator as a pure module with rule-level fixtures, including unknown and contradictory data cases.
4. Release a read-only prototype for those curated products with explanations and no add-to-cart promise.
5. Add inventory/price rechecks, grouped cart support, persistence, analytics/privacy review and accessibility checks.
6. Expand categories only when specification coverage and rule tests meet an agreed quality threshold; maintain a correction and rollback process.
