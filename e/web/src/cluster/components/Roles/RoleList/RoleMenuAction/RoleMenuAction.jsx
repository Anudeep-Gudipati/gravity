import React from 'react';
import MenuAction, { MenuItem } from 'app/cluster/components/components/ActionMenu';

class RoleMenuAction extends React.Component {

  onEdit = () => {
    this.props.onEdit && this.props.onEdit(this.props.id);
  }

  onDelete = () => {
    this.props.onDelete && this.props.onDelete(this.props.id);
  }

  render() {
    return (
      <MenuAction buttonIconProps={ { kindColor: "secondaryLight" }}>
        <MenuItem onClick={this.onEdit}>
          Edit...
        </MenuItem>
        <MenuItem onClick={this.onDelete}>
          Delete...
        </MenuItem>
      </MenuAction>
    )
  }
}

export default RoleMenuAction;