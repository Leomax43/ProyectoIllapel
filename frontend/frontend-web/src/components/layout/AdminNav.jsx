const NAV_ITEMS = [
  { label: 'Inicio', active: false },
  { label: 'Ceropapel', active: false },
  { label: 'Abastecimiento', active: false },
  { label: 'Illapel Te Ayuda', active: true },
  { label: 'Opciones', active: false },
];

function AdminNav() {
  return (
    <nav className="bg-[#2c5282] text-white flex px-6 py-3 shadow-md gap-2 items-center">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.label}
          className={`px-4 py-1 rounded transition ${
            item.active
              ? 'bg-[#1a365d] font-semibold border border-[#1a365d] shadow-inner'
              : 'bg-transparent hover:bg-[#1a365d]'
          }`}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export default AdminNav;
