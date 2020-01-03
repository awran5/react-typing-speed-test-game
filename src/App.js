import React, { useState, useRef, useEffect } from 'react'
import { quotesArray, random, allowedKeys } from './Helper'
import ItemList from './components/ItemList'
import './App.css'

let interval = null

const App = () => {
	const inputRef = useRef(null)
	const outputRef = useRef(null)
	const [ duration, setDuration ] = useState(60)
	const [ started, setStarted ] = useState(false)
	const [ ended, setEnded ] = useState(false)
	const [ index, setIndex ] = useState(0)
	const [ correctIndex, setCorrectIndex ] = useState(0)
	const [ errorIndex, setErrorIndex ] = useState(0)
	const [ quote, setQuote ] = useState({})
	const [ input, setInput ] = useState('')
	const [ cpm, setCpm ] = useState(0)
	const [ wpm, setWpm ] = useState(0)
	const [ accuracy, setAccuracy ] = useState(0)
	const [ isError, setIsError ] = useState(false)
	const [ lastScore, setLastScore ] = useState('0')

	useEffect(() => {
		const newQuote = random(quotesArray)
		setQuote(newQuote)
		setInput(newQuote.quote)
	}, [])

	const handleEnd = () => {
		setEnded(true)
		setStarted(false)
		clearInterval(interval)
	}

	const setTimer = () => {
		const now = Date.now()
		const seconds = now + duration * 1000
		interval = setInterval(() => {
			const secondLeft = Math.round((seconds - Date.now()) / 1000)
			setDuration(secondLeft)
			if (secondLeft === 0) {
				handleEnd()
			}
		}, 1000)
	}

	const handleStart = () => {
		setStarted(true)
		setEnded(false)
		setInput(quote.quote)
		inputRef.current.focus()
		setTimer()
	}

	const handleKeyDown = e => {
		e.preventDefault()
		const { key } = e
		const quoteText = quote.quote

		if (key === quoteText.charAt(index)) {
			setIndex(index + 1)
			const currenChar = quoteText.substring(index + 1, index + quoteText.length)
			setInput(currenChar)
			setCorrectIndex(correctIndex + 1)
			setIsError(false)
			outputRef.current.innerHTML += key
		} else {
			if (allowedKeys.includes(key)) {
				setErrorIndex(errorIndex + 1)
				setIsError(true)
				outputRef.current.innerHTML += `<span class="text-danger">${key}</span>`
			}
		}

		const timeRemains = ((60 - duration) / 60).toFixed(2)
		const _accuracy = Math.floor((index - errorIndex) / index * 100)
		const _wpm = Math.round(correctIndex / 5 / timeRemains)

		if (index > 5) {
			setAccuracy(_accuracy)
			setCpm(correctIndex)
			setWpm(_wpm)
		}

		if (index + 1 === quoteText.length || errorIndex > 50) {
			handleEnd()
		}
	}

	useEffect(
		() => {
			if (ended) localStorage.setItem('wpm', wpm)
		},
		[ ended, wpm ]
	)
	useEffect(() => {
		const stroedScore = localStorage.getItem('wpm')
		if (stroedScore) setLastScore(stroedScore)
	}, [])

	return (
		<div className="App">
			<div className="container-fluid pt-4">
				<div className="row">
					{/* Left */}
					<div className="col-sm-6 col-md-2 order-md-0 px-5">
						<ul className="list-unstyled text-center small">
							<ItemList
								name="WPM"
								data={wpm}
								style={
									wpm > 0 && wpm < 20 ? (
										{ color: 'white', backgroundColor: '#eb4841' }
									) : wpm >= 20 && wpm < 40 ? (
										{ color: 'white', backgroundColor: '#f48847' }
									) : wpm >= 40 && wpm < 60 ? (
										{ color: 'white', backgroundColor: '#ffc84a' }
									) : wpm >= 60 && wpm < 80 ? (
										{ color: 'white', backgroundColor: '#a6c34c' }
									) : wpm >= 80 ? (
										{ color: 'white', backgroundColor: '#4ec04e' }
									) : (
										{}
									)
								}
							/>
							<ItemList name="CPM" data={cpm} />
							<ItemList name="Last Score" data={lastScore} />
						</ul>
					</div>
					{/* Body */}
					<div className="col-sm-12 col-md-8 order-md-1">
						<div className="container">
							<div className="text-center mt-4 header">
								<h1>How Fast Can You Type?</h1>
								<p className="lead">
									Start the one-minute Typing speed test and find out how fast can you type in real
									world!
								</p>

								<div className="alert alert-danger" role="alert">
									Just start typing and don't use <b>backspace</b> to correct your mistakes. Your
									mistakes will be marked in <u>Red</u> color and shown below the writing box. Good
									luck!
								</div>

								<div className="control my-5">
									{ended ? (
										<button
											className="btn btn-outline-danger btn-circle"
											onClick={() => window.location.reload()}
										>
											Reload
										</button>
									) : started ? (
										<button className="btn btn-circle btn-outline-success" disabled>
											Hurry
										</button>
									) : (
										<button className="btn btn-circle btn-outline-success" onClick={handleStart}>
											GO!
										</button>
									)}
									<span className="btn-circle-animation" />
								</div>
							</div>

							{ended ? (
								<div className="bg-dark text-light p-4 mt-5 lead rounded">
									<span>"{quote.quote}"</span>
									<span className="d-block mt-2 text-muted small">- {quote.author}</span>
								</div>
							) : started ? (
								<div
									className={`text-light mono quotes${started ? ' active' : ''}${isError
										? ' is-error'
										: ''}`}
									tabIndex="0"
									onKeyDown={handleKeyDown}
									ref={inputRef}
								>
									{input}
								</div>
							) : (
								<div className="mono quotes text-muted" tabIndex="-1" ref={inputRef}>
									{input}
								</div>
							)}

							<div className="p-4 mt-4 bg-dark text-light rounded lead" ref={outputRef} />

							<h6 className="mt-5">Tip!</h6>
							<ul>
								<li>
									Word Per Minute (WPM) is measured by calculating how many words you can type in 1
									minute.
								</li>
								<li>Character Per Minute (CPM) calculates how many characters are typed per minute.</li>
								<li>
									The top typing speed was achieved by{' '}
									<a
										href="https://en.wikipedia.org/wiki/Typing#Alphanumeric_entry"
										rel="noopener noreferrer"
										target="_blank"
									>
										Stella Pajunas
									</a>{' '}
									in 1946, whereas Mrs. Barbara Blackburn has averaged 150 wpm in 50 minutes and her
									top speed was 212 wpm.
								</li>
							</ul>
							<hr className="my-4" />
							<div className="mb-5">
								<h6 className="py-2">Average Typing Speeds</h6>
								<div className="d-flex text-white meter-gauge">
									<span className="col" style={{ background: '#eb4841' }}>
										0 - 20 Slow
									</span>
									<span className="col" style={{ background: '#f48847' }}>
										20 - 40 Average
									</span>
									<span className="col" style={{ background: '#ffc84a' }}>
										40 - 60 Fast
									</span>
									<span className="col" style={{ background: '#a6c34c' }}>
										60 - 80 Professional
									</span>
									<span className="col" style={{ background: '#4ec04e' }}>
										80 - 100+ Top
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="col-sm-6 col-md-2 order-md-2 px-5">
						<ul className="list-unstyled text-center small">
							<ItemList name="Timers" data={duration} />
							<ItemList name="Errors" data={errorIndex} />
							<ItemList name="Acuracy" data={accuracy} symble="%" />
						</ul>
					</div>
				</div>

				<footer className="small text-muted pt-5 pb-2 footer">
					<div className="footer-info text-center">
						<ul className="list-inline m-1">
							<li className="list-inline-item">v1.0.0</li>
							<li className="list-inline-item"> - </li>
							<li className="list-inline-item">
								<a
									href="https://github.com/awran5/react-typing-speed-test-game"
									target="_blank"
									title="GitHub"
									rel="noopener noreferrer"
								>
									GitHub
								</a>
							</li>
							<li className="list-inline-item"> - </li>
							<li className="list-inline-item">
								<a
									href="https://github.com/awran5/react-typing-speed-test-game/issues"
									target="_blank"
									title="Issues"
									rel="noopener noreferrer"
								>
									Issues
								</a>
							</li>
						</ul>
						<div className="copyright">
							© 2020. Designed and built with
							<span role="img" aria-label="Heart">
								{' '}
								❤️{' '}
							</span>
							by {' '}
							<a href="https://gkstyle.net/" title="GK STYLE">
								GK STYLE
							</a>{' '}
							team.
						</div>
					</div>
				</footer>
			</div>
		</div>
	)
}

export default App
