import { Checkbox, Col } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { IPermissions } from '../roles.interface';

interface IProps {
  permissions: IPermissions[];
  userPermissions?: number[];
  onValueChange: (args: Array<number>) => void;
}

const PermissionsCheckBox = ({
  permissions,
  userPermissions,
  onValueChange,
}: IProps) => {
  // const transformPermissions = (permissionList: IPermissions[]) => {
  //   return permissionList.map((p) => {
  //     return { label: p.attributes.name, value: p.id };
  //   });
  // };

  const [checked, setChecked] = useState<Array<boolean>>([]);
  const values = useRef<Array<number>>(userPermissions || []);

  const handleOnChange = (e: any, index: number) => {
    setChecked((prev) => {
      const newState = [...prev];
      newState[index] = e.target.checked;
      return newState;
    });
    if (e.target.checked && !values.current.includes(e.target.value)) {
      values.current.push(e.target.value);
    }

    if (!e.target.checked && values.current.includes(e.target.value)) {
      const removeIndex = values.current.findIndex((p) => p == e.target.value);
      values.current.splice(removeIndex, 1);
    }
    onValueChange(values.current);
  };

  const initState = () => {
    const newState = [];
    permissions.forEach((p) => {
      newState.push(userPermissions.includes(p.id));
    });
    return newState;
  };

  useEffect(() => {
    userPermissions && setChecked(initState());
    if (userPermissions) {
      values.current = userPermissions;
    }
  }, [permissions, userPermissions]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'baseline',
        marginTop: 10,
      }}
    >
      {permissions.map((p, index) => {
        return (
          <Checkbox
            key={index}
            value={p.id}
            checked={checked[index]}
            onChange={(e) => handleOnChange(e, index)}
          >
            {p.attributes.name}
          </Checkbox>
        );
      })}
    </div>
  );
};

export default PermissionsCheckBox;
