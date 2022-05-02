import React, { useEffect , useState} from 'react'

export default function LanguageSwitcher(props) {
  const [language, setLanguage] = useState(props.language)

  useEffect(() => {props.switchLanguage(language)},[language])

  return (
    <div className='languageSwitcher'>
        <ul>
            <li onClick={()=>{
              setLanguage('es')
            }}><span>🇪🇸 </span></li>
            <li onClick={()=>{
              setLanguage('en')
            }}><span>🇬🇧 </span></li>
            <li onClick={()=>{
              setLanguage('pt')
            }}><span>🇵🇹 </span></li>

        </ul>
    </div>
  )
}
