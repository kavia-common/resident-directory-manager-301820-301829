/**
 * Demo seed data with inline SVG placeholders for photos.
 */
const makePlaceholder = (initials, hue = 210) => {
  const bg = `hsl(${hue}, 90%, 95%)`;
  const fg = `hsl(${hue}, 70%, 45%)`;
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
      <rect width='100%' height='100%' rx='16' fill='${bg}' />
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, Arial' font-size='96' font-weight='700' fill='${fg}'>${initials}</text>
    </svg>`
  );
  return `data:image/svg+xml;charset=UTF-8,${svg}`;
};

export const seedResidents = [
  {
    id: "seed_apt_101",
    name: "Alex Johnson",
    apartment: "101",
    phone: "(555) 123-4567",
    email: "alex.johnson@example.com",
    notes: "",
    photo: makePlaceholder("AJ", 210),
  },
  {
    id: "seed_apt_204",
    name: "Maria Chen",
    apartment: "204",
    phone: "(555) 987-6543",
    email: "maria.chen@example.com",
    notes: "",
    photo: makePlaceholder("MC", 190),
  },
  {
    id: "seed_apt_305",
    name: "Sam Patel",
    apartment: "305",
    phone: "(555) 432-1098",
    email: "sam.patel@example.com",
    notes: "",
    photo: makePlaceholder("SP", 170),
  },
];
