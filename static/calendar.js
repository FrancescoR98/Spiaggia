function loadGantt() {
    const today = new Date();
    const year = today.getFullYear();
    const start = today.toISOString().split('T')[0];
    const endDate = new Date(year, 9, 31); // 31 Ottobre
    const end = endDate.toISOString().split('T')[0];
    fetch(`/dati-range/${start}/${end}`)
        .then(r => r.json())
        .then(data => {
            document.getElementById('gantt').innerHTML = '';
            const tasks = data.map((t, idx) => ({
                id: t.id || ('t' + idx),
                name: t.name,
                start: t.start,
                end: t.end,
                custom_class: t.stato
            }));
            new Gantt('#gantt', tasks, {
                view_mode: 'Day',
                language: 'it'
            });
        });
}

window.addEventListener('load', loadGantt);
