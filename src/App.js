import React, { useState, useEffect } from 'react';
import { Plus, X, Clock, Users, BookOpen, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const EdChronos = () => {
  // Estados principais
  const [activeTab, setActiveTab] = useState('turmas');
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [cronogramas, setCronogramas] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Estados para formulários
  const [novaTurma, setNovaTurma] = useState({
    nome: '',
    temposPorDia: 4,
    periodos: [{ inicio: '07:30', fim: '11:30', intervalos: [{ inicio: '09:00', fim: '09:15' }] }]
  });

  const [novoProfessor, setNovoProfessor] = useState({
    nome: '',
    materias: [],
    turmasDisponiveis: [],
    horarios: []
  });

  const [novaMateria, setNovaMateria] = useState({
    nome: '',
    temposMinimo: 2,
    temposMaximo: 4
  });

  // Função para adicionar turma
  const adicionarTurma = () => {
    if (novaTurma.nome.trim()) {
      const turmaCompleta = {
        ...novaTurma,
        id: Date.now(),
        temposDetalhados: calcularTemposDetalhados(novaTurma)
      };
      setTurmas([...turmas, turmaCompleta]);
      setNovaTurma({
        nome: '',
        temposPorDia: 4,
        periodos: [{ inicio: '07:30', fim: '11:30', intervalos: [{ inicio: '09:00', fim: '09:15' }] }]
      });
    }
  };

  // Função para calcular tempos detalhados
  const calcularTemposDetalhados = (turma) => {
    const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
    const temposDetalhados = {};

    diasSemana.forEach(dia => {
      temposDetalhados[dia] = [];
      turma.periodos.forEach(periodo => {
        const inicioMinutos = timeToMinutes(periodo.inicio);
        const fimMinutos = timeToMinutes(periodo.fim);
        const duracaoTotal = fimMinutos - inicioMinutos;
        
        // Calcular intervalos
        let intervaloTotalMinutos = 0;
        periodo.intervalos?.forEach(intervalo => {
          intervaloTotalMinutos += timeToMinutes(intervalo.fim) - timeToMinutes(intervalo.inicio);
        });

        const tempoAulaMinutos = (duracaoTotal - intervaloTotalMinutos) / turma.temposPorDia;
        
        let horaAtual = inicioMinutos;
        for (let i = 0; i < turma.temposPorDia; i++) {
          // Verificar se há intervalo neste momento
          const intervaloNesteMomento = periodo.intervalos?.find(intervalo => 
            timeToMinutes(intervalo.inicio) <= horaAtual && 
            timeToMinutes(intervalo.fim) > horaAtual
          );

          if (intervaloNesteMomento) {
            horaAtual = timeToMinutes(intervaloNesteMomento.fim);
          }

          temposDetalhados[dia].push({
            numero: i + 1,
            inicio: minutesToTime(horaAtual),
            fim: minutesToTime(horaAtual + tempoAulaMinutos),
            professor: null,
            materia: null
          });

          horaAtual += tempoAulaMinutos;
        }
      });
    });

    return temposDetalhados;
  };

  // Funções auxiliares para conversão de tempo
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Função para adicionar professor
  const adicionarProfessor = () => {
    if (novoProfessor.nome.trim()) {
      setProfessores([...professores, { ...novoProfessor, id: Date.now() }]);
      setNovoProfessor({
        nome: '',
        materias: [],
        turmasDisponiveis: [],
        horarios: []
      });
    }
  };

  // Função para adicionar matéria
  const adicionarMateria = () => {
    if (novaMateria.nome.trim()) {
      setMaterias([...materias, { ...novaMateria, id: Date.now() }]);
      setNovaMateria({
        nome: '',
        temposMinimo: 2,
        temposMaximo: 4
      });
    }
  };

  // Algoritmo de geração de cronograma
  const gerarCronograma = () => {
    const novoCronograma = {};
    const professoresOcupados = {}; // Para evitar conflitos de horário

    // Inicializar cronograma vazio para cada turma
    turmas.forEach(turma => {
      novoCronograma[turma.id] = JSON.parse(JSON.stringify(turma.temposDetalhados));
    });

    // Algoritmo de alocação por prioridade
    const tentativasAlocacao = [];

    // Gerar todas as possíveis alocações
    turmas.forEach(turma => {
      materias.forEach(materia => {
        const professoresCapazes = professores.filter(prof => 
          prof.materias.includes(materia.id) && 
          prof.turmasDisponiveis.includes(turma.id)
        );

        professoresCapazes.forEach(professor => {
          for (let tempos = materia.temposMinimo; tempos <= materia.temposMaximo; tempos++) {
            tentativasAlocacao.push({
              turma: turma.id,
              materia: materia.id,
              professor: professor.id,
              temposNecessarios: tempos,
              prioridade: calcularPrioridade(turma, materia, professor, tempos)
            });
          }
        });
      });
    });

    // Ordenar por prioridade
    tentativasAlocacao.sort((a, b) => b.prioridade - a.prioridade);

    // Alocar tempos
    tentativasAlocacao.forEach(tentativa => {
      const temposLivres = encontrarTemposLivres(
        novoCronograma[tentativa.turma], 
        professoresOcupados, 
        tentativa.professor,
        tentativa.temposNecessarios
      );

      if (temposLivres.length >= tentativa.temposNecessarios) {
        // Alocar os tempos
        for (let i = 0; i < tentativa.temposNecessarios; i++) {
          const tempo = temposLivres[i];
          novoCronograma[tentativa.turma][tempo.dia][tempo.index] = {
            ...novoCronograma[tentativa.turma][tempo.dia][tempo.index],
            professor: tentativa.professor,
            materia: tentativa.materia
          };

          // Marcar professor como ocupado neste horário
          const chaveHorario = `${tempo.dia}-${tempo.inicio}-${tempo.fim}`;
          if (!professoresOcupados[tentativa.professor]) {
            professoresOcupados[tentativa.professor] = new Set();
          }
          professoresOcupados[tentativa.professor].add(chaveHorario);
        }
      }
    });

    setCronogramas(novoCronograma);
    setShowResults(true);
  };

  // Função para calcular prioridade de alocação
  const calcularPrioridade = (turma, materia, professor, tempos) => {
    let prioridade = 100;
    
    // Priorizar matérias com menos tempos disponíveis
    prioridade += (5 - materia.temposMaximo) * 20;
    
    // Priorizar professores com menos turmas disponíveis
    prioridade += (10 - professor.turmasDisponiveis.length) * 10;
    
    // Priorizar alocação mínima de tempos
    if (tempos === materia.temposMinimo) {
      prioridade += 30;
    }

    return prioridade;
  };

  // Função para encontrar tempos livres
  const encontrarTemposLivres = (cronogramaTurma, professoresOcupados, professorId, temposNecessarios) => {
    const temposLivres = [];
    const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];

    diasSemana.forEach(dia => {
      cronogramaTurma[dia].forEach((tempo, index) => {
        if (!tempo.professor && !tempo.materia) {
          const chaveHorario = `${dia}-${tempo.inicio}-${tempo.fim}`;
          const professorOcupado = professoresOcupados[professorId]?.has(chaveHorario);
          
          if (!professorOcupado) {
            temposLivres.push({
              dia,
              index,
              inicio: tempo.inicio,
              fim: tempo.fim
            });
          }
        }
      });
    });

    return temposLivres;
  };

  // Função para obter nome da entidade por ID
  const obterNome = (lista, id) => {
    const item = lista.find(item => item.id === id);
    return item ? item.nome : 'N/A';
  };

  // Renderização das abas
  const renderTabContent = () => {
    switch (activeTab) {
      case 'turmas':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="mr-2" /> Nova Turma
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome da turma"
                  value={novaTurma.nome}
                  onChange={(e) => setNovaTurma({...novaTurma, nome: e.target.value})}
                  className="border rounded-lg px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Tempos por dia"
                  value={novaTurma.temposPorDia}
                  onChange={(e) => setNovaTurma({...novaTurma, temposPorDia: parseInt(e.target.value)})}
                  className="border rounded-lg px-3 py-2"
                  min="1"
                  max="10"
                />
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Períodos de Aula</h4>
                {novaTurma.periodos.map((periodo, index) => (
                  <div key={index} className="border rounded p-3 mb-2">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="time"
                        value={periodo.inicio}
                        onChange={(e) => {
                          const novosPeriodos = [...novaTurma.periodos];
                          novosPeriodos[index].inicio = e.target.value;
                          setNovaTurma({...novaTurma, periodos: novosPeriodos});
                        }}
                        className="border rounded px-2 py-1"
                      />
                      <input
                        type="time"
                        value={periodo.fim}
                        onChange={(e) => {
                          const novosPeriodos = [...novaTurma.periodos];
                          novosPeriodos[index].fim = e.target.value;
                          setNovaTurma({...novaTurma, periodos: novosPeriodos});
                        }}
                        className="border rounded px-2 py-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={adicionarTurma}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="mr-2 w-4 h-4" /> Adicionar Turma
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Turmas Cadastradas</h3>
              <div className="grid gap-4">
                {turmas.map(turma => (
                  <div key={turma.id} className="border rounded-lg p-4">
                    <h4 className="font-medium">{turma.nome}</h4>
                    <p className="text-sm text-gray-600">{turma.temposPorDia} tempos por dia</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'materias':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BookOpen className="mr-2" /> Nova Matéria
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nome da matéria"
                  value={novaMateria.nome}
                  onChange={(e) => setNovaMateria({...novaMateria, nome: e.target.value})}
                  className="border rounded-lg px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Tempos mínimo"
                  value={novaMateria.temposMinimo}
                  onChange={(e) => setNovaMateria({...novaMateria, temposMinimo: parseInt(e.target.value)})}
                  className="border rounded-lg px-3 py-2"
                  min="1"
                />
                <input
                  type="number"
                  placeholder="Tempos máximo"
                  value={novaMateria.temposMaximo}
                  onChange={(e) => setNovaMateria({...novaMateria, temposMaximo: parseInt(e.target.value)})}
                  className="border rounded-lg px-3 py-2"
                  min="1"
                />
              </div>
              <button
                onClick={adicionarMateria}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <Plus className="mr-2 w-4 h-4" /> Adicionar Matéria
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Matérias Cadastradas</h3>
              <div className="grid gap-4">
                {materias.map(materia => (
                  <div key={materia.id} className="border rounded-lg p-4">
                    <h4 className="font-medium">{materia.nome}</h4>
                    <p className="text-sm text-gray-600">
                      {materia.temposMinimo} - {materia.temposMaximo} tempos por semana
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'professores':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="mr-2" /> Novo Professor
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome do professor"
                  value={novoProfessor.nome}
                  onChange={(e) => setNovoProfessor({...novoProfessor, nome: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
                
                <div>
                  <label className="block text-sm font-medium mb-2">Matérias que leciona:</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {materias.map(materia => (
                      <label key={materia.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={novoProfessor.materias.includes(materia.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNovoProfessor({
                                ...novoProfessor,
                                materias: [...novoProfessor.materias, materia.id]
                              });
                            } else {
                              setNovoProfessor({
                                ...novoProfessor,
                                materias: novoProfessor.materias.filter(id => id !== materia.id)
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        {materia.nome}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Turmas disponíveis:</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {turmas.map(turma => (
                      <label key={turma.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={novoProfessor.turmasDisponiveis.includes(turma.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNovoProfessor({
                                ...novoProfessor,
                                turmasDisponiveis: [...novoProfessor.turmasDisponiveis, turma.id]
                              });
                            } else {
                              setNovoProfessor({
                                ...novoProfessor,
                                turmasDisponiveis: novoProfessor.turmasDisponiveis.filter(id => id !== turma.id)
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        {turma.nome}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <button
                onClick={adicionarProfessor}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
              >
                <Plus className="mr-2 w-4 h-4" /> Adicionar Professor
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Professores Cadastrados</h3>
              <div className="grid gap-4">
                {professores.map(professor => (
                  <div key={professor.id} className="border rounded-lg p-4">
                    <h4 className="font-medium">{professor.nome}</h4>
                    <p className="text-sm text-gray-600">
                      Matérias: {professor.materias.map(id => obterNome(materias, id)).join(', ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Turmas: {professor.turmasDisponiveis.map(id => obterNome(turmas, id)).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'cronograma':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="mr-2" /> Gerar Cronograma
              </h3>
              
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{turmas.length}</div>
                    <div className="text-sm text-gray-600">Turmas</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{materias.length}</div>
                    <div className="text-sm text-gray-600">Matérias</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{professores.length}</div>
                    <div className="text-sm text-gray-600">Professores</div>
                  </div>
                </div>
              </div>

              {turmas.length > 0 && materias.length > 0 && professores.length > 0 ? (
                <button
                  onClick={gerarCronograma}
                  className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 flex items-center justify-center text-lg font-medium"
                >
                  <Calendar className="mr-2" /> Gerar Cronograma Automaticamente
                </button>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
                  <AlertTriangle className="text-yellow-600 mr-3" />
                  <div>
                    <p className="font-medium text-yellow-800">Dados Incompletos</p>
                    <p className="text-sm text-yellow-700">
                      Cadastre pelo menos uma turma, uma matéria e um professor para gerar o cronograma.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {showResults && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CheckCircle className="mr-2 text-green-600" /> Cronogramas Gerados
                </h3>
                
                {turmas.map(turma => (
                  <div key={turma.id} className="mb-8">
                    <h4 className="text-lg font-medium mb-4 text-blue-800">{turma.nome}</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-3 py-2 text-left">Horário</th>
                            <th className="border border-gray-300 px-3 py-2">Segunda</th>
                            <th className="border border-gray-300 px-3 py-2">Terça</th>
                            <th className="border border-gray-300 px-3 py-2">Quarta</th>
                            <th className="border border-gray-300 px-3 py-2">Quinta</th>
                            <th className="border border-gray-300 px-3 py-2">Sexta</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cronogramas[turma.id] && cronogramas[turma.id].segunda?.map((_, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                                {cronogramas[turma.id].segunda[index].inicio} - {cronogramas[turma.id].segunda[index].fim}
                              </td>
                              {['segunda', 'terca', 'quarta', 'quinta', 'sexta'].map(dia => {
                                const tempo = cronogramas[turma.id][dia][index];
                                return (
                                  <td key={dia} className="border border-gray-300 px-3 py-2 text-center">
                                    {tempo.materia ? (
                                      <div className="bg-blue-100 rounded p-1">
                                        <div className="font-medium text-xs">
                                          {obterNome(materias, tempo.materia)}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          {obterNome(professores, tempo.professor)}
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistema de Gestão de Cronogramas Escolares
          </h1>
          <p className="text-gray-600 mt-2">
            Plataforma integrada para otimização algorítmica de scheduling pedagógico
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-white p-1 rounded-lg border mb-6">
          {[
            { key: 'turmas', label: 'Turmas', icon: Users },
            { key: 'materias', label: 'Matérias', icon: BookOpen },
            { key: 'professores', label: 'Professores', icon: Users },
            { key: 'cronograma', label: 'Cronograma', icon: Calendar }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                activeTab === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default EdChronos;