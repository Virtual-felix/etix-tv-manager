import React from 'react';
import FontIcon from 'react-md/lib/FontIcons';

export default [{
  key: 'elements',
  primaryText: 'Elements',
  leftIcon: <FontIcon>archive</FontIcon>,
  active: true,
}, {
  key: 'timeline',
  primaryText: 'Timeline',
  leftIcon: <FontIcon>all_inclusive</FontIcon>,
}, {
  key: 'schedule',
  primaryText: 'Schedule',
  leftIcon: <FontIcon>schedule</FontIcon>,
}, {
  key: 'televisions',
  primaryText: 'Televisions',
  leftIcon: <FontIcon>tv</FontIcon>,
}, { key: 'divider', divider: true }, {
  key: 'all-mail',
  primaryText: 'All mail',
  leftIcon: <FontIcon>mail</FontIcon>,
}, {
  key: 'trash',
  primaryText: 'Trash',
  leftIcon: <FontIcon>delete</FontIcon>,
}, {
  key: 'spam',
  primaryText: 'Spam',
  leftIcon: <FontIcon>info</FontIcon>,
}];
