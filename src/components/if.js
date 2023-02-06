/**
 * Component used for conditional rendering.
 *
 * Usage:
 * ------
 *
 * <If condition={isVisible}>
 *      <Text>Visible Text</Text>
 * </If>
 *
 * Instead of
 *
 * {isVisible && <Text>Visible Text</Text>}
 *
 */

 import React from 'react';
 
 const If = ({condition, children}) => {
   return condition ? <>{children}</> : null;
 };
 
 export default If;