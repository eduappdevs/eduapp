import React, {useEffect, useState} from 'react'

export default function LanguageSwitcher(props) {
    const [language, setLanguage] = useState(window.localStorage.getItem('language') || 'en')

    useEffect(() => {
        props.switchLanguage(language)
        window.localStorage.setItem('language', language)
    }, [language])

    return (
        <div className='languageSwitcher'>
            <ul>
                <li onClick={
                    () => {
                        setLanguage('es')
                    }
                }>
                    <span className={
                        language === "es" && "languageSelected"
                    }>🇪🇸
                    </span>
                </li>
                <li onClick={
                    () => {
                        setLanguage('en')
                    }
                }>
                    <span className={
                        language === "en" && "languageSelected"
                    }>🇬🇧
                    </span>
                </li>
                <li onClick={
                    () => {
                        setLanguage('pt')
                    }
                }>
                    <span className={
                        language === "pt" && "languageSelected"
                    }>🇵🇹
                    </span>
                </li>

            </ul>
        </div>
    )
}
