// Definição do grafo com as cidades e as distâncias entre elas
const grafo = {
    "Agronomica": [["Agrolandia", 23.8], ["Pouso Redondo", 25.4]],
    "Agrolandia": [["Petrolandia", 28.3], ["Agronomica", 23.8]],
    "Dona Emma": [["Presidente Getulio", 16.2], ["Lontras", 40.2], ["Rio do Sul", 42.1]],
    "Presidente Getulio": [["Dona Emma", 16.2], ["Ibirama", 14.2], ["Lontras", 20.5], ["Rio do Sul", 25.7]],
    "Ibirama": [["Presidente Getulio", 14.2], ["Lontras", 17.9]],
    "Ituporanga": [["Aurora", 17.4], ["Imbuia", 19.8], ["Agrolandia", 34.3]],
    "Lontras": [["Ibirama", 17.9], ["Presidente Getulio", 20.5], ["Dona Emma", 40.2]],
    "Petrolandia": [["Imbuia", 29.3], ["Agrolandia", 28.3]],
    "Pouso Redondo": [["Trombudo Central", 14.1], ["Agronomica", 25.4]],
    "Rio do Sul": [["Presidente Getulio", 25.7], ["Lontras", 10.3], ["Agronomica", 9.7], ["Dona Emma", 42.1]],
    "Trombudo Central": [["Pouso Redondo", 14.1]],
    "Aurora": [["Ituporanga", 17.4]],
    "Imbuia": [["Ituporanga", 19.8], ["Petrolandia", 29.3]]
};

// Função para o grafo percorrer o caminho nos dois sentidos)
function tornarGrafoBidirecional(grafo) {
    const grafoBidirecional = {};

    // Para cada cidade no grafo original
    for (const cidade in grafo) {
        // Cria uma nova entrada para a cidade no grafo bidirecional
        grafoBidirecional[cidade] = grafo[cidade] || [];

        // Para cada cidade vizinha e distância
        grafo[cidade].forEach(([vizinho, peso]) => {
            // Se o vizinho ainda não estiver no grafo bidirecional, adicionamos ele
            if (!grafoBidirecional[vizinho]) {
                grafoBidirecional[vizinho] = [];
            }

            // Verifica se já existe uma rota de volta 
            const existeRotaDeVolta = grafoBidirecional[vizinho].some(([c, _]) => c === cidade);
            // Se não existir, adiciona a rota de volta
            if (!existeRotaDeVolta) {
                grafoBidirecional[vizinho].push([cidade, peso]);
            } else {
                // Se já existir, atualizamos o valor da distância
                grafoBidirecional[vizinho] = grafoBidirecional[vizinho].map(([c, p]) => {
                    return c === cidade ? [c, peso] : [c, p];
                });
            }
        });
    }

    return grafoBidirecional;
}


function dijkstra(grafo, origem, destino) {
    const distancias = {};  // Guarda as menores distâncias 
    const anteriores = {};  // Guarda qual cidade veio antes de outra no caminho
    const visitados = new Set();  // Cidades que já tem o menor caminho 
    const naoVisitados = new Set(Object.keys(grafo));  // Cidades que ainda não tem o menor caminho

    // Inicializa todas as distâncias como infinito e a cidade de origem com distância 0
    for (const cidade of naoVisitados) {
        distancias[cidade] = Infinity;
        anteriores[cidade] = null;
    }
    distancias[origem] = 0;

    // Enquanto ainda houver cidades pra visitar
    while (naoVisitados.size > 0) {
        let menorDistancia = Infinity;
        let noAtual = null;

        // Encontra a cidade não visitada com a menor distância
        for (const no of naoVisitados) {
            if (distancias[no] < menorDistancia) {
                menorDistancia = distancias[no];
                noAtual = no;
            }
        }

        // Se não houver uma cidade para processar interrompe o loop
        if (noAtual === null) break;

        naoVisitados.delete(noAtual);  // Marca como visitada
        visitados.add(noAtual);

        // Atualiza as distâncias dos vizinhos da cidade atual
        for (const [vizinho, peso] of grafo[noAtual] || []) {
            if (visitados.has(vizinho)) continue;  // Pula se o vizinho já foi visitado
            const novaDistancia = distancias[noAtual] + peso;
            // Se a nova distância for menor atualiza a distância e o caminho anterior
            if (novaDistancia < distancias[vizinho]) {
                distancias[vizinho] = novaDistancia;
                anteriores[vizinho] = noAtual;
            }
        }

        // Se chegar ao destino, para o loop
        if (noAtual === destino) break;
    }

    // Volta o caminho percorrendo de volta as cidades anteriores
    const caminho = [];
    let no = destino;
    while (no !== null) {
        caminho.unshift(no);  // Adiciona a cidade no início do caminho
        no = anteriores[no];
    }

    // Se houver um caminho encontrado retorna o caminho e a distância final
    return caminho.length > 1 ? [caminho, distancias[destino]] : [null, Infinity];
}

// Função que executa o cálculo do caminho mais curto quando o botão for clicado
function calcularCaminho() {
    const origem = document.getElementById('origem').value;  // Pega a cidade de origem selecionada
    const destino = document.getElementById('destino').value;  // Pega a cidade de destino selecionada

    const [caminho, custo] = dijkstra(grafoBidirecional, origem, destino);  

    const resultadoDiv = document.getElementById('resultado');  
    if (caminho) {
        // Mostra o caminho encontrado e o custo
        resultadoDiv.textContent = `Caminho de ${origem} até ${destino}: ${caminho.join(' -> ')}. Custo: ${custo.toFixed(2)}`;
    } else {
        
        resultadoDiv.textContent = `Não foi possível encontrar um caminho de ${origem} até ${destino}.`;
    }
}

// Função para preencher as opções de cidades 
function preencherCidades() {
    const cidades = Object.keys(grafo);  // Pega todas as cidades do grafo
    const origemSelect = document.getElementById('origem');  // Seleciona cidade de origem
    const destinoSelect = document.getElementById('destino');  // Seleciona cidade de destino

    
    // Adiciona cada cidade como uma opção nos seletores de origem e destino
    cidades.forEach(cidade => {
        const option1 = document.createElement('option');
        option1.value = cidade;
        option1.textContent = cidade;
        origemSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = cidade;
        option2.textContent = cidade;
        destinoSelect.appendChild(option2);
    });
}

// Torna o grafo original para o com caminhos nos dois sentidos
const grafoBidirecional = tornarGrafoBidirecional(grafo);

// Quando a página carregar executa essas funções aqui
window.onload = function() {
    preencherCidades();  // Preenche as cidades no seletor
    document.getElementById('calcBtn').addEventListener('click', calcularCaminho);  // Adiciona o evento de clique para calcular o caminho
};
