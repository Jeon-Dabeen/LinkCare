'use client';


import { createContext, ReactNode, useContext, useState } from "react";

import clsx from "clsx";
import styles from '@/styles/components/tab.module.css';


type TabsProps = {
  children: ReactNode;
  defaultValue: string;
  value?: string,
  onChange?: (value: string) => void;
}

type TabNavProps = {
  children: ReactNode;
}

type TabNavItemProps = {
  value: string;
  title: string;
}

type TabsContentProps = {
  value: string;
  children: ReactNode;
}

type TabsContextType = {
  activeValue: string;
  changeTab: (value: string) => void;
}


const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext(){
  const context = useContext(TabsContext);

  if(!context){
    throw new Error('Tab Context Error');
  }

  return context;
}


export function Tabs({
  defaultValue,
  value,
  children,
  onChange
}: TabsProps){

  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = value ?? internalValue;

  const changeTab = (nextValue: string) => {
    if(value === undefined){
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  }

  return (
    <TabsContext.Provider
      value={{
        activeValue,
        changeTab
      }}
    >
      <div className={styles.TabsWrapper}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}


function TabNav({
  children
}: TabNavProps){

  return (
    <nav className={styles.tabNav}>{children}</nav>
  )
}

function TabNavItem({
  title,
  value
}: TabNavItemProps){

  const {
    activeValue,
    changeTab
  } = useTabsContext();

  const active = activeValue === value;

  return (
    <button
      type="button"
      value={value}
      className={clsx(
        styles.tabNavItem,
        active && styles.active
      )}
      onClick={() => changeTab(value)}
    >
      {title}
    </button>
  )
}

function TabContent({
  value,
  children
}: TabsContentProps){

  const {activeValue} = useTabsContext();

  if(activeValue !== value){
    return null;
  }

  return (
    <div className={styles.tabContent}>
      {children}
    </div>
  )
}

Tabs.Nav = TabNav;
Tabs.NavItem = TabNavItem;
Tabs.Content = TabContent;

export default Tabs;


