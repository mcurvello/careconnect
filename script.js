// URL da API para interagir com os sintomas
const apiUrl = 'http://localhost:5001/symptoms';

// Adiciona um listener para o formulário de adição de sintomas
document.getElementById('addSymptomForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevê o comportamento padrão do formulário

  // Cria um objeto FormData para coletar os dados do formulário
  const formData = new FormData();
  formData.append('name', document.getElementById('symptomName').value);
  formData.append('severity', document.getElementById('severity').value);
  formData.append('symptom_type', document.getElementById('type').value);
  formData.append('occurred_at', document.getElementById('occurredAt').value + ' ' + document.getElementById('occurredTime').value);

  // Envia os dados para a API para adicionar um novo sintoma
  const response = await fetch('http://127.0.0.1:5001/symptom', {
      method: 'POST',
      body: formData
  });

  // Verifica se a requisição foi bem-sucedida
  if (response.ok) {
      document.getElementById('addSymptomForm').reset(); // Limpa o formulário
      loadSymptoms(); // Recarrega a lista de sintomas
  } else {
      alert('Erro ao adicionar sintoma'); // Exibe mensagem de erro
  }
});

// Função assíncrona para carregar a lista de sintomas
async function loadSymptoms() {
    const response = await fetch(apiUrl); // Faz a requisição para a API
    const data = await response.json(); // Converte a resposta em JSON
    const symptomList = document.getElementById('symptomList');
    symptomList.innerHTML = ''; // Limpa a lista atual

    // Adiciona cada sintoma como uma nova linha na tabela
    data.symptoms.forEach((symptom) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${symptom.date}</td>
            <td>${symptom.name}</td>
            <td>${symptom.severity}</td>
            <td>${symptom.type}</td>
            <td>
                <button onclick="editSymptom(${symptom.id})">Editar</button>
                <button onclick="deleteSymptom(${symptom.id})">Excluir</button>
                <button onclick="loadDetails(${symptom.id})">Ver Detalhes</button>
            </td>
        `;
        symptomList.appendChild(row); // Adiciona a nova linha à tabela
    });
}

// Função para carregar os detalhes de um sintoma específico
async function loadDetails(symptomId) {
  const response = await fetch(`http://localhost:5001/symptom?id=${symptomId}`); // Faz a requisição para a API
  const symptom = await response.json(); // Converte a resposta em JSON

  // Atualiza as informações do sintoma no HTML
  console.log(symptom);
  document.getElementById('nameSymptom').textContent = symptom.name || 'Nome não disponível';
  document.getElementById('symptomSeverity').textContent = symptom.severity || 'Severidade não disponível';
  document.getElementById('symptomType').textContent = symptom.type || 'Tipo não disponível';
  document.getElementById('symptomOccurredAt').textContent = 
  (symptom.date ? symptom.date : 'Data não disponível') + 
  ' ' + 
  (symptom.time ? symptom.time : 'Hora não disponível');

  // Atualiza a lista de detalhes
  const detailList = document.getElementById('detailList');
  detailList.innerHTML = '';

  if (symptom.details && symptom.details.length > 0) {
      symptom.details.forEach((detail) => {
          const listItem = document.createElement('li');
          listItem.textContent = detail.text;
          detailList.appendChild(listItem); // Adiciona cada detalhe à lista
      });
  } else {
      detailList.innerHTML = '<li>Nenhum detalhe encontrado.</li>'; // Mensagem caso não haja detalhes
  }

  // Atualiza o ID do sintoma selecionado
  document.getElementById('selectedSymptomId').value = symptomId;

  // Exibe a seção de detalhes
  document.getElementById('detailSection').style.display = 'block';
}

// Listener para adicionar um novo detalhe ao sintoma
document.getElementById('addDetailForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevê o comportamento padrão do formulário

  // Cria um objeto FormData para coletar os dados do formulário
  const formData = new FormData();
  formData.append('symptom_id', document.getElementById('selectedSymptomId').value);
  formData.append('text', document.getElementById('detailText').value);

  // Envia os dados para a API para adicionar um novo detalhe
  const response = await fetch('http://localhost:5001/detail', {
      method: 'POST',
      body: formData
  });

  // Verifica se a requisição foi bem-sucedida
  if (response.ok) {
      document.getElementById('addDetailForm').reset(); // Limpa o formulário
      loadDetails(document.getElementById('selectedSymptomId').value);  // Recarrega os detalhes após a adição
  } else {
      alert('Erro ao adicionar detalhe'); // Exibe mensagem de erro
  }
});

// Carrega os sintomas ao inicializar a página
loadSymptoms();

// Função para editar um sintoma existente
async function editSymptom(id) {
  const newName = prompt('Novo nome do sintoma:'); // Solicita novo nome do sintoma
  if (newName) {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('name', newName);

      // Envia os dados para a API para atualizar o sintoma
      const response = await fetch('http://127.0.0.1:5001/symptom', {
          method: 'PATCH',
          body: formData
      });

      // Verifica se a requisição foi bem-sucedida
      if (response.ok) {
          loadSymptoms(); // Recarrega a lista de sintomas
      } else {
          alert('Erro ao editar sintoma'); // Exibe mensagem de erro
      }
  }
}

// Função para excluir um sintoma
async function deleteSymptom(id) {
  const response = await fetch(`http://localhost:5001/symptom?id=${id}`, {
      method: 'DELETE' // Envia a requisição para deletar o sintoma
  });
  if (response.ok) {
      loadSymptoms(); // Recarrega a lista de sintomas após a exclusão
  } else {
      alert('Erro ao excluir sintoma'); // Exibe mensagem de erro
  }
}

// Carrega os sintomas ao inicializar
loadSymptoms();
