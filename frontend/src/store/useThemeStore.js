import {create} from 'zustand'

export const useThemeStore = create((set)=>({
  //pake localStorage biar kalo page nya di refresh, pake theme yang terakhir dipilih
  theme:localStorage.getItem('streamify-theme') || 'retro',
  setTheme : (theme)=>{
    set({theme})
    localStorage.setItem('streamify-theme',theme)
  }
}))
