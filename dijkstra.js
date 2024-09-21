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

// Função para tornar o grafo bidirecional garantindo simetria de pesos
function tornarGrafoBidirecional(grafo) {
    const grafoBidirecional = {};

    for (const cidade in grafo) {
        grafoBidirecional[cidade] = grafo[cidade] || [];

        grafo[cidade].forEach(([vizinho, peso]) => {
            if (!grafoBidirecional[vizinho]) {
                grafoBidirecional[vizinho] = [];
            }

            // Garantir que o peso da volta seja o mesmo
            const existeRotaDeVolta = grafoBidirecional[vizinho].some(([c, _]) => c === cidade);
            if (!existeRotaDeVolta) {
                grafoBidirecional[vizinho].push([cidade, peso]);
            } else {
                // Atualizar o peso para garantir que seja o mesmo
                grafoBidirecional[vizinho] = grafoBidirecional[vizinho].map(([c, p]) => {
                    return c === cidade ? [c, peso] : [c, p];
                });
            }
        });
    }

    return grafoBidirecional;
}

// Algoritmo de Dijkstra
function dijkstra(grafo, origem, destino) {
    const distancias = {};
    const anteriores = {};
    const visitados = new Set();
    const naoVisitados = new Set(Object.keys(grafo));

    // Inicializar distâncias
    for (const cidade of naoVisitados) {
        distancias[cidade] = Infinity;
        anteriores[cidade] = null;
    }
    distancias[origem] = 0;

    while (naoVisitados.size > 0) {
        // Encontrar o nó com a menor distância
        let menorDistancia = Infinity;
        let noAtual = null;

        for (const no of naoVisitados) {
            if (distancias[no] < menorDistancia) {
                menorDistancia = distancias[no];
                noAtual = no;
            }
        }

        if (noAtual === null) break; // Nenhum nó restante

        naoVisitados.delete(noAtual);
        visitados.add(noAtual);

        // Atualizar distâncias para os vizinhos
        for (const [vizinho, peso] of grafo[noAtual] || []) {
            if (visitados.has(vizinho)) continue;
            const novaDistancia = distancias[noAtual] + peso;
            if (novaDistancia < distancias[vizinho]) {
                distancias[vizinho] = novaDistancia;
                anteriores[vizinho] = noAtual;
            }
        }

        if (noAtual === destino) break;
    }

    // Reconstruir o caminho
    const caminho = [];
    let no = destino;
    while (no !== null) {
        caminho.unshift(no);
        no = anteriores[no];
    }

    return caminho.length > 1 ? [caminho, distancias[destino]] : [null, Infinity];
}

// Função para calcular o caminho ao clicar no botão
function calcularCaminho() {
    const origem = document.getElementById('origem').value;
    const destino = document.getElementById('destino').value;

    const [caminho, custo] = dijkstra(grafoBidirecional, origem, destino);

    const resultadoDiv = document.getElementById('resultado');
    if (caminho) {
        resultadoDiv.textContent = `Caminho de ${origem} até ${destino}: ${caminho.join(' -> ')}. Custo: ${custo.toFixed(2)}`;
    } else {
        resultadoDiv.textContent = `Não foi possível encontrar um caminho de ${origem} até ${destino}.`;
    }
}

// Preencher as cidades ao carregar a página
function preencherCidades() {
    const cidades = Object.keys(grafo);
    const origemSelect = document.getElementById('origem');
    const destinoSelect = document.getElementById('destino');

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

// Inicializar grafo bidirecional
const grafoBidirecional = tornarGrafoBidirecional(grafo);

// Adicionar eventos e inicializar
window.onload = function() {
    preencherCidades();
    document.getElementById('calcBtn').addEventListener('click', calcularCaminho);
};
