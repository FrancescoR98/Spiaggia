function loadGantt() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    if (!start || !end) return;
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

document.getElementById('loadBtn').addEventListener('click', loadGantt);
document.getElementById('startDate').addEventListener('change', loadGantt);
document.getElementById('endDate').addEventListener('change', loadGantt);

window.addEventListener('load', () => {
    const today = new Date();
    const start = today.toISOString().split('T')[0];
    const next = new Date();
    next.setDate(today.getDate() + 30);
    const end = next.toISOString().split('T')[0];
    document.getElementById('startDate').value = start;
    document.getElementById('endDate').value = end;
    loadGantt();
});
