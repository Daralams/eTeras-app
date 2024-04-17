import React, {useState, useEffect} from "react"
import { CiLight } from "react-icons/ci"
import { CiDark } from "react-icons/ci"

const ThemeModeBtn = () => {
  const [click, setClick] = useState(false)
  
  useEffect(() => {
    // Memuat nilai isLightMode dari localStorage saat komponen dimuat
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setClick(JSON.parse(savedMode));
    }
  }, []); // Efek hanya dijalankan saat komponen dipasang (kondisi kosong)
  
  const changeMode = () => {
    setClick(!click)
  }
  
  useEffect(() => {
    // Menyimpan nilai isLightMode ke dalam localStorage saat nilai berubah
    localStorage.setItem('themeMode', JSON.stringify(click));
  }, [click]); // Efek hanya dijalankan saat nilai isLightMode berubah
  
  return (
    <div className="border-2 border-white rounded-full flex items-center p-1">
      <button className="text-white text-2xl" onClick={changeMode}>
      {click ? <CiDark/> : <CiLight/>
      }</button>
    </div>
    )
}

export default ThemeModeBtn