document.addEventListener('DOMContentLoaded', () => {
    const entradaBtn = document.getElementById('entradaBtn');
    const saidaBtn = document.getElementById('saidaBtn');
    const descricaoInput = document.getElementById('descricao');
    const quantidadeInput = document.getElementById('quantidade');
    const registrarBtn = document.getElementById('registrarBtn');
    const downloadPDFBtn = document.getElementById('downloadPDFBtn');
    const historicoList = document.getElementById('historico');

    let selectedOperation = '';
    let historicoData = JSON.parse(localStorage.getItem('historico')) || [];

    function updateButtonStyles() {
        entradaBtn.classList.remove('clicked');
        saidaBtn.classList.remove('clicked');

        if (selectedOperation === 'entrada') {
            entradaBtn.classList.add('clicked');
        } else if (selectedOperation === 'saída') {
            saidaBtn.classList.add('clicked');
        }
    }

    function updateHistoricoUI() {
        historicoList.innerHTML = '';

        historicoData.sort((a, b) => b.timestamp - a.timestamp);

        historicoData.forEach((item, index) => {
            const li = document.createElement('li');
            const date = new Date(item.timestamp);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            li.textContent = `📅 ${formattedDate} | ${item.tipo.toUpperCase()} de ${item.quantidade} 🐮 ${item.descricao}.`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '❌';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => {
                historicoData.splice(index, 1);
                localStorage.setItem('historico', JSON.stringify(historicoData));
                updateHistoricoUI();
            });

            li.appendChild(deleteBtn);
            historicoList.appendChild(li);
        });
    }

    function downloadText() {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        let textContent = `Arquivo baixado no dia ${formattedDate}.\n\n`;

        historicoData.forEach(item => {
            const date = new Date(item.timestamp);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            textContent += `Data: ${formattedDate} | Tipo: ${item.tipo.toUpperCase()} | Descrição: ${item.descricao} | Quantidade: ${item.quantidade}\n`;
        });

        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'historico.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    downloadPDFBtn.addEventListener('click', downloadText);

    entradaBtn.addEventListener('click', () => {
        selectedOperation = 'entrada';
        updateButtonStyles();
    });

    saidaBtn.addEventListener('click', () => {
        selectedOperation = 'saída';
        updateButtonStyles();
    });

    const descricaoSelect = document.getElementById('descricao');

    registrarBtn.addEventListener('click', () => {
        const descricao = descricaoSelect.value; 
        const quantidade = parseInt(quantidadeInput.value);

        if (isNaN(quantidade) || quantidade <= 0) {
            alert('A quantidade deve ser maior que zero.');
            return;
        }

        if (!isNaN(quantidade) && descricao !== '' && selectedOperation !== '') {
            historicoData.push({
                tipo: selectedOperation,
                quantidade,
                descricao,
                timestamp: Date.now()
            });

            localStorage.setItem('historico', JSON.stringify(historicoData));
            updateHistoricoUI();
            descricaoInput.value = '';
            quantidadeInput.value = '';
            selectedOperation = '';
            updateButtonStyles();
        } else {
            alert('Faltou preencher algum campo.');
        }
    });

    updateHistoricoUI();
});
