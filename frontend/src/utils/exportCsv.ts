export const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    // Escape quotes and wrap strings containing commas in quotes
    const escapeCsv = (val: string | number) => {
        if (typeof val === 'string') {
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                return `"${val.replace(/"/g, '""')}"`;
            }
        }
        return val;
    };

    const sCsvContent = [
        headers.join(','),
        ...rows.map(row => row.map(escapeCsv).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + sCsvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
