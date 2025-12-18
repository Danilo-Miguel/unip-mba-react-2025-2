import React, { useEffect, useRef, useState } from 'react'

function Texto({ children, variant = 'body', color = 'gray-800', className = '' }) {
  const variants = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-medium',
    body: 'text-base',
    small: 'text-sm',
    caption: 'text-xs',
  }

  const Tag = variant.startsWith('h') ? variant : 'p'
  const classes = `${variants[variant]} text-${color} ${className}`

  return <Tag className={classes}>{children}</Tag>
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
}) {
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-purple-500 hover:bg-purple-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    outline: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const classes = `
    ${variants[variant]}
    ${sizes[size]}
    rounded-button
    font-medium
    transition-all
    duration-200
    shadow-soft
    disabled:opacity-50
    disabled:cursor-not-allowed
    ${className}
  `

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

function Card({ title, children, footer, className = '', variant = 'default' }) {
  const variants = {
    default: 'bg-white border border-gray-200',
    primary: 'bg-blue-50 border border-blue-200',
    success: 'bg-green-50 border border-green-200',
    warning: 'bg-yellow-50 border border-yellow-200',
  }

  return (
    <div className={`${variants[variant]} rounded-card shadow-card p-6 ${className}`}>
      {title && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <Texto variant="h3">{title}</Texto>
        </div>
      )}
      <div className="space-y-4">{children}</div>
      {footer && <div className="mt-4 pt-4 border-t border-gray-200">{footer}</div>}
    </div>
  )
}

function Calendario({ diaSelecionado, onDiaClick }) {
  const hoje = new Date()
  const mesAtual = hoje.getMonth()
  const anoAtual = hoje.getFullYear()
  const diaHoje = hoje.getDate()

  const [diaHover, setDiaHover] = useState(null)
  const calendarioRef = useRef(null)

  useEffect(() => {
    if (diaSelecionado) {
      console.log(`📅 Dia selecionado: ${diaSelecionado}`)
    }
  }, [diaSelecionado])

  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate()
  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay()

  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const dias = []
  for (let i = 0; i < primeiroDia; i += 1) {
    dias.push(null)
  }
  for (let dia = 1; dia <= diasNoMes; dia += 1) {
    dias.push(dia)
  }

  return (
    <Card title={`${meses[mesAtual]} ${anoAtual}`}>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {diasSemana.map((dia) => (
          <div key={dia} className="text-center font-semibold text-gray-600 text-sm">
            {dia}
          </div>
        ))}
      </div>

      <div ref={calendarioRef} className="grid grid-cols-7 gap-2">
        {dias.map((dia, index) => (
          <div
            key={`${dia}-${index}`}
            onClick={() => dia && onDiaClick && onDiaClick(dia)}
            onMouseEnter={() => dia && setDiaHover(dia)}
            onMouseLeave={() => setDiaHover(null)}
            className={`
              h-10 rounded-button text-sm font-medium
              flex items-center justify-center
              transition-all duration-200
              ${!dia ? 'invisible' : 'cursor-pointer'}
              ${dia === diaSelecionado
                ? 'bg-blue-500 text-white shadow-md scale-110'
                : dia === diaHoje
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                  : dia === diaHover
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            {dia}
          </div>
        ))}
      </div>
    </Card>
  )
}

function CompromissoItem({ id, horario, titulo, descricao, onRemove }) {
  return (
    <div className="bg-white p-4 rounded-default border border-gray-200 hover:shadow-md transition-shadow flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-blue-600 font-bold text-lg">🕐 {horario}</span>
          <Texto variant="h4">{titulo}</Texto>
        </div>
        {descricao && (
          <Texto variant="small" color="gray-600">
            {descricao}
          </Texto>
        )}
      </div>
      <Button variant="danger" size="sm" onClick={() => onRemove(id)} className="ml-3">
        X
      </Button>
    </div>
  )
}

function Agenda({ data, compromissos, onRemove }) {
  return (
    <Card title="Agenda do Dia" variant="primary">
      <Texto variant="body" color="gray-600" className="capitalize">
        📅 {data}
      </Texto>

      <div className="space-y-3">
        <Texto variant="h4">Compromissos ({compromissos.length})</Texto>

        {compromissos.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-default">
            <Texto variant="body" color="gray-500">
              📅 Nenhum compromisso para hoje
            </Texto>
          </div>
        ) : (
          compromissos.map((compromisso) => (
            <CompromissoItem
              key={compromisso.id}
              id={compromisso.id}
              horario={compromisso.horario}
              titulo={compromisso.titulo}
              descricao={compromisso.descricao}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </Card>
  )
}

function HistoricoAgenda({ historico }) {
  const totalCompromissos = historico.reduce((total, dia) => total + dia.compromissos.length, 0)

  return (
    <Card
      title="Histórico da Agenda"
      variant="default"
      footer={
        <Texto variant="small" color="gray-600">
          Total: {totalCompromissos} compromissos registrados
        </Texto>
      }
    >
      {historico.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-default">
          <Texto variant="h3" color="gray-400" className="mb-2">
            📋
          </Texto>
          <Texto variant="body" color="gray-500">
            Nenhum compromisso registrado ainda
          </Texto>
        </div>
      ) : (
        <div className="space-y-6">
          {historico.map((diaHistorico, index) => (
            <div key={`${diaHistorico.data}-${index}`} className="space-y-2">
              <div className="flex items-center gap-2">
                <Texto variant="h4" color="blue-600">
                  📅 {diaHistorico.data}
                </Texto>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
                  {diaHistorico.compromissos.length}
                </span>
              </div>
              <div className="space-y-2 ml-4">
                {diaHistorico.compromissos.map((compromisso) => (
                  <div key={compromisso.id} className="bg-gray-50 p-3 rounded-default border-l-4 border-blue-500">
                    <div className="flex items-center gap-2">
                      <Texto variant="small" color="blue-600" className="font-bold">
                        {compromisso.horario}
                      </Texto>
                      <Texto variant="small" className="font-semibold">
                        {compromisso.titulo}
                      </Texto>
                    </div>
                    {compromisso.descricao && (
                      <Texto variant="caption" color="gray-600" className="mt-1">
                        {compromisso.descricao}
                      </Texto>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

function App() {
  const hoje = new Date()

  const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate())
  const [compromissosPorDia, setCompromissosPorDia] = useState({
    18: [
      { id: 1, horario: '09:00', titulo: 'Reunião de Equipe', descricao: 'Discutir andamento do projeto React' },
      { id: 2, horario: '12:30', titulo: 'Almoço com Cliente', descricao: 'Restaurante Villa Bisutti' },
      { id: 3, horario: '15:00', titulo: 'Aula de React', descricao: 'Estudar Props e Componentes' },
    ],
    19: [
      { id: 4, horario: '10:00', titulo: 'Médico', descricao: 'Consulta de rotina' },
      { id: 5, horario: '14:00', titulo: 'Academia', descricao: '' },
    ],
    20: [{ id: 6, horario: '11:00', titulo: 'Dentista', descricao: 'Limpeza' }],
  })

  const [compromissosHoje, setCompromissosHoje] = useState([])

  useEffect(() => {
    const compromissos = compromissosPorDia[diaSelecionado] || []
    setCompromissosHoje(compromissos)
    console.log(`📅 Compromissos do dia ${diaSelecionado}:`, compromissos.length)
  }, [diaSelecionado, compromissosPorDia])

  useEffect(() => {
    document.title = `Agenda - Dia ${diaSelecionado}`
  }, [diaSelecionado])

  const removerCompromisso = (id) => {
    setCompromissosPorDia((prev) => {
      const diaAtual = prev[diaSelecionado] || []
      return {
        ...prev,
        [diaSelecionado]: diaAtual.filter((c) => c.id !== id),
      }
    })
  }

  const handleDiaClick = (dia) => {
    setDiaSelecionado(dia)
    console.log(`✅ Dia ${dia} selecionado!`)
  }

  const dataFormatada = hoje.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const historico = [
    {
      data: '18/11/2025',
      compromissos: [
        { id: 10, horario: '10:00', titulo: 'Médico', descricao: 'Consulta de rotina' },
        { id: 11, horario: '14:00', titulo: 'Academia', descricao: '' },
      ],
    },
    {
      data: '17/11/2025',
      compromissos: [
        { id: 20, horario: '09:00', titulo: 'Trabalho', descricao: 'Início do projeto novo' },
        { id: 21, horario: '16:00', titulo: 'Reunião Online', descricao: 'Com a equipe de marketing' },
      ],
    },
    {
      data: '16/11/2025',
      compromissos: [{ id: 30, horario: '11:00', titulo: 'Dentista', descricao: 'Limpeza' }],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Texto variant="h1" className="mb-2">
            📅 Agenda React
          </Texto>
          <Texto variant="body" color="gray-600">
            Aplicação para consolidar conceitos de Props e Componentes
          </Texto>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Calendario diaSelecionado={diaSelecionado} onDiaClick={handleDiaClick} />
          </div>

          <div className="lg:col-span-1">
            <Agenda data={dataFormatada} compromissos={compromissosHoje} onRemove={removerCompromisso} />
          </div>

          <div className="lg:col-span-1">
            <HistoricoAgenda historico={historico} />
          </div>
        </div>

        <div className="mt-8">
          <Card variant="success">
            <Texto variant="h4" className="mb-3">
              🎓 Conceitos Aprendidos
            </Texto>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Texto variant="small" className="font-semibold mb-1">
                  ✅ Props
                </Texto>
                <Texto variant="caption" color="gray-600">
                  Passagem de dados entre componentes (variant, size, children, etc.)
                </Texto>
              </div>
              <div>
                <Texto variant="small" className="font-semibold mb-1">
                  ✅ Componentes Reutilizáveis
                </Texto>
                <Texto variant="caption" color="gray-600">
                  Texto, Button, Card, Calendario, Agenda e Histórico
                </Texto>
              </div>
              <div>
                <Texto variant="small" className="font-semibold mb-1">
                  ✅ Composição
                </Texto>
                <Texto variant="caption" color="gray-600">
                  Componentes dentro de outros componentes (Card com Texto e Button)
                </Texto>
              </div>
              <div>
                <Texto variant="small" className="font-semibold mb-1">
                  ✅ Design Tokens
                </Texto>
                <Texto variant="caption" color="gray-600">
                  Cores, fontes, bordas arredondadas e tamanhos padronizados
                </Texto>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
