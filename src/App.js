import React, { useState, useEffect } from 'react';
import { Plus, X, Clock, Users, BookOpen, Calendar, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import './App.css';

// Componente para configurar disponibilidade de horários do professor
const ProfessorScheduleConfig = ({ horarios, setHorarios, turmas }) => {
  const diasSemana = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' }
  ];

  const periodosComuns = [
    { label: 'Manhã (07:00 - 12:00)', inicio: '07:00', fim: '12:00' },
    { label: 'Tarde (13:00 - 18:00)', inicio: '13:00', fim: '18:00' },
    { label: 'Noite (19:00 - 23:00)', inicio: '19:00', fim: '23:00' }
  ];

  const toggleDisponibilidade = (dia, periodo) => {
    const novaDisponibilidade = [...horarios];
    const index = novaDisponibilidade.findIndex(h => 
      h.dia === dia && h.inicio === periodo.inicio && h.fim === periodo.fim
    );

    if (index >= 0) {
      // Remove disponibilidade
      novaDisponibilidade.splice(index, 1);
    } else {
      // Adiciona disponibilidade
      novaDisponibilidade.push({
        dia,
        inicio: periodo.inicio,
        fim: periodo.fim,
        label: periodo.label
      });
    }
    
    setHorarios(novaDisponibilidade);
  };

  const isDisponivel = (dia, periodo) => {
    return horarios.some(h => 
      h.dia === dia && h.inicio === periodo.inicio && h.fim === periodo.fim
    );
  };

  const adicionarHorarioCustomizado = (dia) => {
    const inicio = prompt('Horário de início (HH:MM):');
    const fim = prompt('Horário de fim (HH:MM):');
    
    if (inicio && fim) {
      const novaDisponibilidade = [...horarios];
      novaDisponibilidade.push({
        dia,
        inicio,
        fim,
        label: `${inicio} - ${fim}`,
        customizado: true
      });
      setHorarios(novaDisponibilidade);
    }
  };

  const removerHorarioCustomizado = (index) => {
    const novaDisponibilidade = [...horarios];
    novaDisponibilidade.splice(index, 1);
    setHorarios(novaDisponibilidade);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#374151',
        marginBottom: '0.75rem'
      }}>
        Disponibilidade de Horários:
      </label>
      
      {/* Grid de disponibilidade */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '150px repeat(3, 1fr)',
        gap: '0.5rem',
        marginBottom: '1rem',
        fontSize: '0.75rem'
      }}>
        {/* Header */}
        <div style={{ fontWeight: 600, color: '#374151' }}>Dia da Semana</div>
        {periodosComuns.map(periodo => (
          <div key={periodo.inicio} style={{ 
            fontWeight: 600, 
            color: '#374151',
            textAlign: 'center',
            padding: '0.25rem'
          }}>
            {periodo.label.split(' ')[0]}
          </div>
        ))}

        {/* Linhas dos dias */}
        {diasSemana.map(dia => (
          <React.Fragment key={dia.key}>
            <div style={{ 
              fontWeight: 500, 
              color: '#4b5563',
              display: 'flex',
              alignItems: 'center'
            }}>
              {dia.label}
            </div>
            {periodosComuns.map(periodo => (
              <div key={`${dia.key}-${periodo.inicio}`} style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => toggleDisponibilidade(dia.key, periodo)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    backgroundColor: isDisponivel(dia.key, periodo) ? '#10b981' : '#f9fafb',
                    color: isDisponivel(dia.key, periodo) ? 'white' : '#4b5563',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {isDisponivel(dia.key, periodo) ? '✓ Disponível' : 'Indisponível'}
                </button>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Horários customizados */}
      {horarios.filter(h => h.customizado).length > 0 && (
        <div style={{
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          padding: '0.75rem',
          marginTop: '1rem'
        }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            margin: '0 0 0.5rem 0'
          }}>
            Horários Personalizados:
          </h4>
          {horarios.filter(h => h.customizado).map((horario, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: '0.5rem',
              borderRadius: '4px',
              marginBottom: '0.25rem',
              fontSize: '0.75rem'
            }}>
              <span>
                <strong>{diasSemana.find(d => d.key === horario.dia)?.label}:</strong> {horario.label}
              </span>
              <button
                onClick={() => removerHorarioCustomizado(horarios.indexOf(horario))}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '3px',
                  fontSize: '0.625rem',
                  cursor: 'pointer'
                }}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botões para adicionar horários customizados */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginTop: '0.75rem',
        flexWrap: 'wrap'
      }}>
        {diasSemana.map(dia => (
          <button
            key={dia.key}
            type="button"
            onClick={() => adicionarHorarioCustomizado(dia.key)}
            style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#e5e7eb',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#374151'
            }}
          >
            + {dia.label.split('-')[0]}
          </button>
        ))}
      </div>

      <p style={{
        fontSize: '0.75rem',
        color: '#6b7280',
        marginTop: '0.75rem',
        fontStyle: 'italic'
      }}>
        💡 Marque os períodos em que o professor está disponível. 
        Use horários personalizados para restrições específicas.
      </p>
    </div>
  );
};

// Componente de Modal de Ajuda Corrigido
const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '900px',
          maxHeight: '90vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <HelpCircle style={{ color: '#2563eb', marginRight: '0.75rem' }} size={24} />
            <h2 style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#111827'
            }}>
              Manual de Ajuda - EdChronos
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.color = '#4b5563'}
            onMouseOut={(e) => e.target.style.color = '#9ca3af'}
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem'
        }}>
          <div style={{ maxWidth: 'none' }}>
            
            {/* Seção 1: Introdução */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                🕐 EdChronos - Sistema de Gestão de Cronogramas Escolares
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: '#4b5563',
                fontWeight: 500,
                marginBottom: '1.5rem'
              }}>
                Plataforma integrada para otimização algorítmica de scheduling pedagógico
              </p>
              
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#1e40af',
                  margin: '0 0 0.5rem 0'
                }}>
                  ⚡ Como Usar em 4 Passos Simples:
                </h3>
                <ol style={{
                  margin: 0,
                  paddingLeft: '1.25rem',
                  color: '#1e40af'
                }}>
                  <li style={{ marginBottom: '0.25rem' }}>Cadastre as <strong>Turmas</strong> com períodos e horários</li>
                  <li style={{ marginBottom: '0.25rem' }}>Cadastre as <strong>Matérias</strong> com cargas horárias</li>
                  <li style={{ marginBottom: '0.25rem' }}>Cadastre os <strong>Professores</strong> e suas disponibilidades</li>
                  <li style={{ marginBottom: '0.25rem' }}>Clique em <strong>"Gerar Cronograma"</strong> automaticamente</li>
                </ol>
              </div>
            </div>

            {/* Seção 2: Turmas */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                🏫 Cadastro de Turmas
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: '#4b5563',
                  marginBottom: '0.5rem'
                }}>
                  Como Cadastrar:
                </h3>
                <ol style={{
                  margin: 0,
                  paddingLeft: '1.25rem',
                  color: '#6b7280'
                }}>
                  <li>Vá para a aba <strong>"Turmas"</strong></li>
                  <li><strong>Nome da Turma</strong>: Ex: "3º Ano A", "Turma Matemática"</li>
                  <li><strong>Tempos por Dia</strong>: Quantidade de aulas diárias (4-6)</li>
                  <li><strong>Períodos</strong>: Horário de início e fim das aulas</li>
                </ol>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '1rem'
              }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  margin: '0 0 0.5rem 0'
                }}>
                  Exemplos Práticos:
                </h4>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: '#4b5563',
                  backgroundColor: 'white',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db'
                }}>
                  <div>Turma: "1º Ano A - Ensino Médio"</div>
                  <div>Tempos por Dia: 5</div>
                  <div>Período: 07:30 - 12:00 (Manhã)</div>
                  <br />
                  <div>Turma: "9º Ano B - Fundamental"</div>
                  <div>Tempos por Dia: 4</div>
                  <div>Período: 13:00 - 17:00 (Tarde)</div>
                </div>
              </div>
            </div>

            {/* Seção 3: Matérias */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                📚 Cadastro de Matérias
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: '#4b5563',
                  marginBottom: '0.5rem'
                }}>
                  Como Cadastrar:
                </h3>
                <ol style={{
                  margin: 0,
                  paddingLeft: '1.25rem',
                  color: '#6b7280'
                }}>
                  <li><strong>Nome da Matéria</strong>: Nome oficial da disciplina</li>
                  <li><strong>Tempos Mínimos</strong>: Mínimo de aulas por semana</li>
                  <li><strong>Tempos Máximos</strong>: Máximo de aulas por semana</li>
                </ol>
              </div>

              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '6px',
                padding: '1rem'
              }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#166534',
                  margin: '0 0 0.75rem 0'
                }}>
                  📊 Orientações por Disciplina:
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <div><strong>Português:</strong> 4-6 tempos/semana</div>
                  <div><strong>Matemática:</strong> 4-6 tempos/semana</div>
                  <div><strong>História:</strong> 2-3 tempos/semana</div>
                  <div><strong>Geografia:</strong> 2-3 tempos/semana</div>
                  <div><strong>Ed. Física:</strong> 1-2 tempos/semana</div>
                  <div><strong>Artes:</strong> 1-2 tempos/semana</div>
                </div>
              </div>
            </div>

            {/* Seção 4: Professores */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                👨‍🏫 Cadastro de Professores
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: '#4b5563',
                  marginBottom: '0.5rem'
                }}>
                  Como Cadastrar:
                </h3>
                <ul style={{
                  margin: 0,
                  paddingLeft: '1.25rem',
                  color: '#6b7280'
                }}>
                  <li><strong>Nome</strong>: Nome completo do professor</li>
                  <li><strong>Matérias</strong>: Selecione todas as disciplinas que pode ensinar</li>
                  <li><strong>Turmas</strong>: Escolha as turmas onde pode atuar</li>
                </ul>
              </div>

              <div style={{
                backgroundColor: '#fefce8',
                border: '1px solid #fef3c7',
                borderRadius: '6px',
                padding: '1rem'
              }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#92400e',
                  margin: '0 0 0.75rem 0'
                }}>
                  💡 Exemplos de Configuração:
                </h4>
                <div style={{ fontSize: '0.875rem', color: '#a16207' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong>Professor Polivalente:</strong><br />
                    Nome: "Maria Silva" | Matérias: Português, Literatura | Turmas: 1º e 2º Anos
                  </div>
                  <div>
                    <strong>Professor Especialista:</strong><br />
                    Nome: "João Santos" | Matérias: Física, Matemática | Turmas: 2º e 3º Anos
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 5: Cronograma */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                📅 Geração de Cronograma
              </h2>
              
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#dc2626',
                  margin: '0 0 0.5rem 0'
                }}>
                  ⚠️ Antes de Gerar:
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#dc2626'
                }}>
                  Certifique-se de ter pelo menos 1 turma, 1 matéria e 1 professor cadastrados!
                </p>
              </div>
              
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 500,
                color: '#4b5563',
                marginBottom: '0.5rem'
              }}>
                Como o Algoritmo Funciona:
              </h3>
              <ul style={{
                margin: 0,
                paddingLeft: '1.25rem',
                color: '#6b7280'
              }}>
                <li><strong>Evita conflitos</strong>: Nenhum professor em dois lugares simultaneamente</li>
                <li><strong>Respeita limites</strong>: Carga horária mínima e máxima das matérias</li>
                <li><strong>Otimiza distribuição</strong>: Espalha aulas equilibradamente</li>
                <li><strong>Prioriza restrições</strong>: Recursos limitados primeiro</li>
              </ul>
            </div>

            {/* Seção 6: Dicas */}
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                💡 Dicas Importantes
              </h2>
              
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #7dd3fc',
                borderRadius: '6px',
                padding: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#0284c7',
                  margin: '0 0 0.75rem 0'
                }}>
                  ✅ Para Melhores Resultados:
                </h3>
                <ul style={{
                  margin: 0,
                  paddingLeft: '1.25rem',
                  color: '#0284c7',
                  fontSize: '0.875rem'
                }}>
                  <li>Seja específico nos nomes de turmas e matérias</li>
                  <li>Configure corretamente a disponibilidade dos professores</li>
                  <li>Use cargas horárias realistas para as disciplinas</li>
                  <li>Tenha professores suficientes para todas as matérias</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #e5e7eb',
          padding: '1rem 1.5rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0 0 12px 12px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#4b5563'
            }}>
              💡 <strong>Dica:</strong> Mantenha esta ajuda aberta enquanto configura o sistema
            </p>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              Fechar Ajuda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EdChronosLogo = ({ size = 40 }) => (
  <img 
  src={`${process.env.PUBLIC_URL}/logo250.png`} 
  alt="EdChronos Logo" 
  style={{ width: '64px', height: '64px', marginRight: '12px' }}
/>
);

const EdChronos = () => {
  // Estados principais
  const [activeTab, setActiveTab] = useState('turmas');
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [cronogramas, setCronogramas] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Função para excluir turma
const excluirTurma = (id) => {
  if (window.confirm('Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.')) {
    setTurmas(turmas.filter(turma => turma.id !== id));
    // Limpar cronogramas se existirem
    if (cronogramas[id]) {
      const novosCronogramas = { ...cronogramas };
      delete novosCronogramas[id];
      setCronogramas(novosCronogramas);
    }
    // Remover turma da disponibilidade dos professores
    setProfessores(professores.map(professor => ({
      ...professor,
      turmasDisponiveis: professor.turmasDisponiveis.filter(turmaId => turmaId !== id)
    })));
  }
};

// Função para excluir matéria
const excluirMateria = (id) => {
  if (window.confirm('Tem certeza que deseja excluir esta matéria? Esta ação não pode ser desfeita.')) {
    setMaterias(materias.filter(materia => materia.id !== id));
    // Remover matéria dos professores
    setProfessores(professores.map(professor => ({
      ...professor,
      materias: professor.materias.filter(materiaId => materiaId !== id)
    })));
    // Limpar cronogramas existentes pois podem estar inválidos
    setCronogramas({});
    setShowResults(false);
  }
};

// Função para excluir professor
const excluirProfessor = (id) => {
  if (window.confirm('Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.')) {
    setProfessores(professores.filter(professor => professor.id !== id));
    // Limpar cronogramas existentes pois podem estar inválidos
    setCronogramas({});
    setShowResults(false);
  }
};

// Função para editar turma (opcional - para facilitar correções)
const editarTurma = (id) => {
  const turma = turmas.find(t => t.id === id);
  if (turma) {
    setNovaTurma({
      nome: turma.nome,
      temposPorDia: turma.temposPorDia,
      periodos: turma.periodos
    });
    // Remover a turma antiga
    setTurmas(turmas.filter(t => t.id !== id));
  }
};

// Função para editar matéria
const editarMateria = (id) => {
  const materia = materias.find(m => m.id === id);
  if (materia) {
    setNovaMateria({
      nome: materia.nome,
      temposMinimo: materia.temposMinimo,
      temposMaximo: materia.temposMaximo
    });
    setMaterias(materias.filter(m => m.id !== id));
  }
};

// Função para editar professor
const editarProfessor = (id) => {
  const professor = professores.find(p => p.id === id);
  if (professor) {
    setNovoProfessor({
      nome: professor.nome,
      materias: professor.materias,
      turmasDisponiveis: professor.turmasDisponiveis,
      horarios: professor.horarios || []
    });
    setProfessores(professores.filter(p => p.id !== id));
  }
};

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

  // Função para verificar disponibilidade do professor em horário específico
const professorDisponivelNoHorario = (professorId, dia, inicio, fim) => {
  const professor = professores.find(p => p.id === professorId);
  if (!professor || !professor.horarios || professor.horarios.length === 0) {
    return true; // Se não há restrições, assume disponível
  }

  // Verificar se há sobreposição com horários disponíveis
  return professor.horarios.some(horario => {
    if (horario.dia !== dia) return false;
    
    const horarioInicio = timeToMinutes(horario.inicio);
    const horarioFim = timeToMinutes(horario.fim);
    const aulaInicio = timeToMinutes(inicio);
    const aulaFim = timeToMinutes(fim);
    
    // Verificar se a aula está dentro do horário disponível
    return aulaInicio >= horarioInicio && aulaFim <= horarioFim;
  });
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
  if (novaMateria.nome.trim() && novaMateria.temposMinimo <= novaMateria.temposMaximo) {
    setMaterias([...materias, { ...novaMateria, id: Date.now() }]);
    setNovaMateria({
      nome: '',
      temposMinimo: 2,
      temposMaximo: 4
    });
  } else {
    alert('Verifique se o nome foi preenchido e se o mínimo não é maior que o máximo.');
  }
};

// Função para calcular prioridade de uma necessidade
const calcularPrioridadeNecessidade = (turma, materia, professoresDisponiveis) => {
  let prioridade = 100;
  
  // Menor número de professores disponíveis = maior prioridade (menor número)
  prioridade -= (10 - professoresDisponiveis.length) * 20;
  
  // Maior diferença entre máximo e mínimo = menor prioridade
  const flexibilidade = materia.temposMaximo - materia.temposMinimo;
  prioridade += flexibilidade * 5;
  
  // Matérias com carga horária alta têm prioridade
  prioridade -= materia.temposMinimo * 3;
  
  return prioridade;
};

// Função para escolher o melhor professor para um horário
const escolherMelhorProfessor = (professoresDisponiveis, professoresOcupados, tempo) => {
  // Filtrar professores disponíveis no horário
  const professoresLivres = professoresDisponiveis.filter(professor => {
    const chaveHorario = `${tempo.dia}-${tempo.inicio}-${tempo.fim}`;
    const ocupado = professoresOcupados[professor.id]?.has(chaveHorario);
    
    if (ocupado) return false;
    
    return professorDisponivelNoHorario(professor.id, tempo.dia, tempo.inicio, tempo.fim);
  });

  if (professoresLivres.length === 0) return null;

  // Escolher professor com menor carga de trabalho atual
  return professoresLivres.reduce((melhor, atual) => {
    const cargaAtual = professoresOcupados[atual.id]?.size || 0;
    const cargaMelhor = professoresOcupados[melhor.id]?.size || 0;
    
    return cargaAtual < cargaMelhor ? atual : melhor;
  });
};

// Função melhorada para encontrar tempos livres
const encontrarTemposLivresMelhorado = (cronogramaTurma, professoresOcupados, professoresDisponiveis, turmaId) => {
  const temposLivres = [];
  const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];

  diasSemana.forEach(dia => {
    cronogramaTurma[dia].forEach((tempo, index) => {
      if (!tempo.professor && !tempo.materia) {
        // Verificar se pelo menos um professor está disponível neste horário
        const algumProfessorDisponivel = professoresDisponiveis.some(professor => {
          const chaveHorario = `${dia}-${tempo.inicio}-${tempo.fim}`;
          const professorOcupado = professoresOcupados[professor.id]?.has(chaveHorario);
          
          if (professorOcupado) return false;
          
          // Verificar restrições de horário do professor
          return professorDisponivelNoHorario(professor.id, dia, tempo.inicio, tempo.fim);
        });

        if (algumProfessorDisponivel) {
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

  // Embaralhar para distribuir melhor ao longo da semana
  for (let i = temposLivres.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [temposLivres[i], temposLivres[j]] = [temposLivres[j], temposLivres[i]];
  }

  return temposLivres;
};

// Algoritmo melhorado de geração de cronograma
const gerarCronogramaMelhorado = () => {
  console.log('Iniciando geração de cronograma melhorado...');
  
  const novoCronograma = {};
  const professoresOcupados = {}; // professor -> Set de "dia-inicio-fim"
  const estatisticas = {
    tentativasTotal: 0,
    sucessos: 0,
    falhas: 0,
    detalhes: []
  };

  // Inicializar cronograma vazio para cada turma
  turmas.forEach(turma => {
    novoCronograma[turma.id] = JSON.parse(JSON.stringify(turma.temposDetalhados));
  });

  // Criar lista de necessidades por matéria e turma
  const necessidades = [];
  
  turmas.forEach(turma => {
    materias.forEach(materia => {
      const professoresCapazes = professores.filter(prof => 
        prof.materias.includes(materia.id) && 
        prof.turmasDisponiveis.includes(turma.id)
      );

      if (professoresCapazes.length > 0) {
        necessidades.push({
          turmaId: turma.id,
          turmaNome: turma.nome,
          materiaId: materia.id,
          materiaNome: materia.nome,
          temposMinimo: materia.temposMinimo,
          temposMaximo: materia.temposMaximo,
          professoresDisponiveis: professoresCapazes,
          temposAlocados: 0,
          prioridade: calcularPrioridadeNecessidade(turma, materia, professoresCapazes)
        });
      }
    });
  });

  // Ordenar necessidades por prioridade (menor = mais prioritário)
  necessidades.sort((a, b) => a.prioridade - b.prioridade);
  
  console.log('Necessidades identificadas:', necessidades);

  // Algoritmo de alocação em rodadas
  let rodada = 0;
  let progressoNaRodada = true;

  while (progressoNaRodada && rodada < 10) { // Máximo 10 rodadas para evitar loop infinito
    progressoNaRodada = false;
    rodada++;
    
    console.log(`\n--- RODADA ${rodada} ---`);

    necessidades.forEach(necessidade => {
      if (necessidade.temposAlocados >= necessidade.temposMaximo) {
        return; // Já atingiu o máximo
      }

      // Tentar alocar mais um tempo para esta necessidade
      const temposLivres = encontrarTemposLivresMelhorado(
        novoCronograma[necessidade.turmaId],
        professoresOcupados,
        necessidade.professoresDisponiveis,
        necessidade.turmaId
      );

      if (temposLivres.length > 0) {
        // Escolher o melhor professor disponível
        const melhorProfessor = escolherMelhorProfessor(
          necessidade.professoresDisponiveis,
          professoresOcupados,
          temposLivres[0] // Usar o primeiro tempo livre
        );

        if (melhorProfessor) {
          const tempo = temposLivres[0];
          
          // Verificar disponibilidade do professor no horário
          if (professorDisponivelNoHorario(melhorProfessor.id, tempo.dia, tempo.inicio, tempo.fim)) {
            // Alocar o tempo
            novoCronograma[necessidade.turmaId][tempo.dia][tempo.index] = {
              ...novoCronograma[necessidade.turmaId][tempo.dia][tempo.index],
              professor: melhorProfessor.id,
              materia: necessidade.materiaId
            };

            // Marcar professor como ocupado
            const chaveHorario = `${tempo.dia}-${tempo.inicio}-${tempo.fim}`;
            if (!professoresOcupados[melhorProfessor.id]) {
              professoresOcupados[melhorProfessor.id] = new Set();
            }
            professoresOcupados[melhorProfessor.id].add(chaveHorario);

            necessidade.temposAlocados++;
            progressoNaRodada = true;
            estatisticas.sucessos++;

            console.log(`✓ Alocado: ${necessidade.materiaNome} para ${necessidade.turmaNome} com ${melhorProfessor.nome} (${tempo.dia} ${tempo.inicio}-${tempo.fim})`);
          }
        }
      }

      estatisticas.tentativasTotal++;
    });
  }

  // Verificar necessidades não atendidas
  const necessidadesNaoAtendidas = necessidades.filter(n => n.temposAlocados < n.temposMinimo);
  
  if (necessidadesNaoAtendidas.length > 0) {
    console.warn('⚠️ Necessidades não atendidas:', necessidadesNaoAtendidas);
    
    // Mostrar alerta para o usuário
    const mensagemAlerta = necessidadesNaoAtendidas.map(n => 
      `• ${n.materiaNome} para ${n.turmaNome}: ${n.temposAlocados}/${n.temposMinimo} tempos alocados`
    ).join('\n');
    
    alert(`Atenção! Algumas matérias não atingiram a carga horária mínima:\n\n${mensagemAlerta}\n\nSugestões:\n- Verifique a disponibilidade dos professores\n- Considere aumentar os períodos das turmas\n- Revise as cargas horárias das matérias`);
  }

  console.log('Estatísticas da geração:', estatisticas);
  console.log('Cronograma final:', novoCronograma);

  setCronogramas(novoCronograma);
  setShowResults(true);
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
                <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Nome da Turma *
    </label>
    <input
      type="text"
      placeholder="Ex: 3º Ano A, Turma de Matemática"
      value={novaTurma.nome}
      onChange={(e) => setNovaTurma({...novaTurma, nome: e.target.value})}
      className="border rounded-lg px-3 py-2 w-full"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Tempos de Aula por Dia *
    </label>
    <input
      type="number"
      placeholder="4"
      value={novaTurma.temposPorDia}
      onChange={(e) => setNovaTurma({...novaTurma, temposPorDia: parseInt(e.target.value)})}
      className="border rounded-lg px-3 py-2 w-full"
      min="1"
      max="10"
    />
    <p className="text-xs text-gray-500 mt-1">
      Quantidade de períodos de aula por dia (geralmente entre 4-6)
    </p>
  </div>
              </div>
              
              <div className="mt-4">
  <h4 className="font-medium mb-2">Períodos de Aula</h4>
  <p className="text-sm text-gray-600 mb-3">
    Configure os horários de funcionamento da turma (ex: manhã, tarde ou integral)
  </p>
  {novaTurma.periodos.map((periodo, index) => (
    <div key={index} className="border rounded p-3 mb-2 bg-gray-50">
      <h5 className="text-sm font-medium text-gray-700 mb-2">
        Período {index + 1}
      </h5>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Horário de Início
          </label>
          <input
            type="time"
            value={periodo.inicio}
            onChange={(e) => {
              const novosPeriodos = [...novaTurma.periodos];
              novosPeriodos[index].inicio = e.target.value;
              setNovaTurma({...novaTurma, periodos: novosPeriodos});
            }}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Horário de Término
          </label>
          <input
            type="time"
            value={periodo.fim}
            onChange={(e) => {
              const novosPeriodos = [...novaTurma.periodos];
              novosPeriodos[index].fim = e.target.value;
              setNovaTurma({...novaTurma, periodos: novosPeriodos});
            }}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Ex: Manhã (07:30 - 11:30), Tarde (13:00 - 17:00)
      </p>
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
    <div key={turma.id} className="border rounded-lg p-4 flex justify-between items-center">
      <div>
        <h4 className="font-medium">{turma.nome}</h4>
        <p className="text-sm text-gray-600">{turma.temposPorDia} tempos por dia</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => editarTurma(turma.id)}
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
          title="Editar turma"
        >
          ✏️ Editar
        </button>
        <button
          onClick={() => excluirTurma(turma.id)}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          title="Excluir turma"
        >
          🗑️ Excluir
        </button>
      </div>
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
              <div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Nome da Matéria/Disciplina *
    </label>
    <input
      type="text"
      placeholder="Ex: Matemática, Português, História"
      value={novaMateria.nome}
      onChange={(e) => setNovaMateria({...novaMateria, nome: e.target.value})}
      className="border rounded-lg px-3 py-2 w-full"
    />
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tempos Mínimos por Semana *
      </label>
      <input
        type="number"
        placeholder="2"
        value={novaMateria.temposMinimo}
        onChange={(e) => setNovaMateria({...novaMateria, temposMinimo: parseInt(e.target.value)})}
        className="border rounded-lg px-3 py-2 w-full"
        min="1"
        max="20"
      />
      <p className="text-xs text-gray-500 mt-1">
        Quantidade mínima de aulas por semana para esta matéria
      </p>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tempos Máximos por Semana *
      </label>
      <input
        type="number"
        placeholder="4"
        value={novaMateria.temposMaximo}
        onChange={(e) => setNovaMateria({...novaMateria, temposMaximo: parseInt(e.target.value)})}
        className="border rounded-lg px-3 py-2 w-full"
        min="1"
        max="20"
      />
      <p className="text-xs text-gray-500 mt-1">
        Quantidade máxima de aulas por semana para esta matéria
      </p>
    </div>
  </div>
  
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
    <div className="flex items-start">
      <div className="text-blue-600 mr-2">💡</div>
      <div>
        <p className="text-sm text-blue-800 font-medium">Dica de Preenchimento:</p>
        <p className="text-xs text-blue-700">
          Para Matemática e Português: 4-6 tempos/semana<br/>
          Para História e Geografia: 2-3 tempos/semana<br/>
          Para Ed. Física e Artes: 1-2 tempos/semana
        </p>
      </div>
    </div>
  </div>
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
      <div key={materia.id} className="border rounded-lg p-4 flex justify-between items-center">
        <div>
          <h4 className="font-medium">{materia.nome}</h4>
          <p className="text-sm text-gray-600">
            {materia.temposMinimo} - {materia.temposMaximo} tempos por semana
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => editarMateria(materia.id)}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
            title="Editar matéria"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => excluirMateria(materia.id)}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            title="Excluir matéria"
          >
            🗑️ Excluir
          </button>
        </div>
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
                {/* ADICIONE O COMPONENTE AQUI - APÓS A SEÇÃO DE TURMAS DISPONÍVEIS */}
          <ProfessorScheduleConfig 
            horarios={novoProfessor.horarios}
            setHorarios={(horarios) => setNovoProfessor({...novoProfessor, horarios})}
            turmas={turmas}
          />
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
      <div key={professor.id} className="border rounded-lg p-4 flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium">{professor.nome}</h4>
          <p className="text-sm text-gray-600">
            Matérias: {professor.materias.map(id => obterNome(materias, id)).join(', ')}
          </p>
          <p className="text-sm text-gray-600">
            Turmas: {professor.turmasDisponiveis.map(id => obterNome(turmas, id)).join(', ')}
          </p>
          {professor.horarios && professor.horarios.length > 0 && (
            <p className="text-xs text-blue-600 mt-1">
              ⏰ Horários configurados: {professor.horarios.length} períodos
            </p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => editarProfessor(professor.id)}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
            title="Editar professor"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => excluirProfessor(professor.id)}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            title="Excluir professor"
          >
            🗑️ Excluir
          </button>
        </div>
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
                  onClick={gerarCronogramaMelhorado}
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
      {/* Header corrigido */}
<div className="bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-4 py-6">
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      justifyContent: 'space-between',
      position: 'relative' 
    }}>
      {/* Conteúdo principal do header */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <EdChronosLogo size={48} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            EdChronos
          </h1>
          <p className="text-gray-600 mt-2">
            Sistema de Geração de Cronogramas de Aulas
          </p>
        </div>
      </div>
      
      {/* Botão de Ajuda - Canto Superior Direito */}
      <button
        onClick={() => setShowHelpModal(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          position: 'absolute',
          top: 0,
          right: 0
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#1d4ed8';
          e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#2563eb';
          e.target.style.transform = 'translateY(0)';
        }}
        title="Abrir Manual de Ajuda"
      >
        <HelpCircle size={20} style={{ marginRight: '0.5rem' }} />
        <span>Ajuda</span>
      </button>
    </div>
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
      <HelpModal 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
      />
    </div>
  );
};

export default EdChronos;