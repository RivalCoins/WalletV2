import React, { CSSProperties, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { NavItemContent, NavItemMenu } from 'models';
import RouteName from 'staticRes/routes';
import SpringLoad from 'components/common/SpringLoad';

import * as S from './styels';

type AppProps = {
  menus: NavItemMenu[];
  contents: NavItemContent[];
  style?: CSSProperties;
};

const BottomBar = ({ menus, contents, style }: AppProps) => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(1);
  const [anim, setAnim] = useState(true);

  const menuWidth = 100 / menus.length;
  const borderMove = 100 * (activeMenu - 1);

  const onChangeMenu = (id: number) => {
    setActiveMenu(id);
    router.push({
      pathname: RouteName.Home,
      query: { menu: id },
    });

    setAnim(true);
  };

  useEffect(() => {
    if (router.query.menu) {
      const menuId = parseInt(router.query.menu as string, 10);
      setActiveMenu(menuId);
    } else {
      setActiveMenu(1);
    }

    setTimeout(() => {
      setAnim(false);
    }, 1000);
  }, [router]);

  return (
    <>
      {contents.map((content) => {
        if (content.id === activeMenu) {
          return (
            <div>
              {anim ? (
                <SpringLoad key={content.id}>
                  {content.component}
                </SpringLoad>
              ) : (
                <div key={content.id}>{content.component}</div>
              )}
            </div>
          );
        }
        return null;
      })}

      <div className="h-[60px]">
        <S.List style={style}>
          {menus.map((menu) => (
            <li
              key={menu.id}
              onClick={() => onChangeMenu(menu.id)}
              className={activeMenu === menu.id ? 'active' : ''}
              style={{ width: `${menuWidth}%` }}
            >
              {menu.id === 1 && (
                <S.Border style={{ left: `${borderMove}%` }} />
              )}
              {menu.icon}
            </li>
          ))}
        </S.List>
      </div>
    </>
  );
};
BottomBar.defaultProps = {
  style: {},
};
export default BottomBar;
