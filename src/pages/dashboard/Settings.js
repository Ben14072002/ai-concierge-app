import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Switch, FormControlLabel, Paper, Grid, Divider } from '@mui/material';
import { useUX } from '../../hooks/useUX';

const Settings = () => {
  const { t } = useTranslation();
  const { preferences, saveUserPreferences, accessibility, saveAccessibilitySettings } = useUX();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailUpdates: true,
    highContrast: false,
    screenReader: false,
    reducedMotion: false
  });

  const handleChange = (name) => (event) => {
    const newSettings = {
      ...settings,
      [name]: event.target.checked
    };
    setSettings(newSettings);

    if (['highContrast', 'screenReader', 'reducedMotion'].includes(name)) {
      saveAccessibilitySettings({
        ...accessibility,
        [name]: event.target.checked
      });
    } else {
      saveUserPreferences({
        ...preferences,
        [name]: event.target.checked
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('settings.title')}
        </Typography>

        <Grid container spacing={3}>
          {/* Allgemeine Einstellungen */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {t('settings.general')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={handleChange('notifications')}
                  color="primary"
                />
              }
              label={t('settings.notifications')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={handleChange('darkMode')}
                  color="primary"
                />
              }
              label={t('settings.darkMode')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailUpdates}
                  onChange={handleChange('emailUpdates')}
                  color="primary"
                />
              }
              label={t('settings.emailUpdates')}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Barrierefreiheit-Einstellungen */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {t('settings.accessibility')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.highContrast}
                  onChange={handleChange('highContrast')}
                  color="primary"
                />
              }
              label={t('settings.highContrast')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.screenReader}
                  onChange={handleChange('screenReader')}
                  color="primary"
                />
              }
              label={t('settings.screenReader')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.reducedMotion}
                  onChange={handleChange('reducedMotion')}
                  color="primary"
                />
              }
              label={t('settings.reducedMotion')}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Settings; 