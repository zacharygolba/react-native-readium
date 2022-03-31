import React, { useCallback, useState, useRef, useEffect } from 'react';
import { View, Platform, findNodeHandle, StyleSheet } from 'react-native';

import type { Dimensions } from '../interfaces';
import { Settings } from '../interfaces';
import { createFragment, getWidthOrHeightValue as dimension } from '../utils';
import type { BaseReadiumViewProps } from './BaseReadiumView';
import { BaseReadiumView } from './BaseReadiumView';

type ReadiumProps = BaseReadiumViewProps;

export const ReadiumView: React.FC<ReadiumProps> = ({
  onLocationChange: wrappedOnLocationChange,
  settings: unmappedSettings,
  ...props
}) => {
  const ref = useRef(null);
  const [{ height, width }, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  // set the view dimensions on layout
  const onLayout = useCallback(({ nativeEvent: { layout: { width, height } }}) => {
    setDimensions({
      width: dimension(width),
      height: dimension(height),
    });
  }, []);
  // wrap the native onLocationChange and extract the raw event value
  const onLocationChange = useCallback((event: any) => {
    if (wrappedOnLocationChange) {
      wrappedOnLocationChange(event.nativeEvent);
    }
  }, [wrappedOnLocationChange]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const viewId = findNodeHandle(ref.current);
      createFragment(viewId);
    }
  }, [])

  return (
    <View
      style={styles.container}
      onLayout={onLayout}
    >
      <BaseReadiumView
        height={height}
        width={width}
        {...props}
        onLocationChange={onLocationChange}
        settings={unmappedSettings ? Settings.map(unmappedSettings) : undefined}
        ref={ref}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%' },
});
