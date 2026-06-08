import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../services/firebase';
import { getOutfits } from '../services/outfitService';
import { logDailyOutfit, getTodayOutfit } from '../services/usageService';
import ScreenLayout from '../components/ScreenLayout';
import { dailyOutfitLoggerStyles as s } from '../styles/screens/dailyOutfitLogger';
import theme from '../styles/theme';

export default function DailyOutfitLoggerScreen({ navigation }) {
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState([]);
  const [todayLog, setTodayLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const userId = auth.currentUser?.uid;

  const fetchData = useCallback(async () => {
    try {
      setFetchError(null);
      const [outfitsData, todayData] = await Promise.all([
        getOutfits(userId),
        getTodayOutfit(userId),
      ]);

      setOutfits(outfitsData);
      setTodayLog(todayData);

      if (todayData) {
        setSelectedOutfit(todayData.outfit);
        setRating(todayData.rating || 0);
        setNotes(todayData.notes || '');
        setPhotos(todayData.photos || []);
      }
    } catch (error) {
      setFetchError('Could not load your outfit data. Pull down to refresh.');
    }
  }, [userId]);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleSave = async () => {
    if (!selectedOutfit) {
      Alert.alert('Select an outfit', 'Please choose an outfit first.');
      return;
    }

    const logData = {
      outfitId: selectedOutfit.id,
      rating,
      notes,
      photos,
    };

    setSaving(true);
    try {
      await logDailyOutfit(userId, logData);
      Alert.alert('Outfit logged! 🎉', 'Your daily outfit has been saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save outfit log. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderStars = () => (
    <View style={s.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)} style={s.starButton}>
          <FontAwesome
            name={star <= rating ? 'star' : 'star-o'}
            size={30}
            color={star <= rating ? theme.colors.accent.gold : theme.colors.border.medium}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScreenLayout navigation={navigation} title="Daily Log">
      {loading ? (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary.warmBrown} />
        </View>
      ) : (
        <>
          <Text style={s.pageTitle}>
            📅 Today's Outfit
          </Text>
          {todayLog ? (
            <Text style={s.pageTitleAlreadyLogged}>Already logged</Text>
          ) : null}

          {fetchError ? (
            <Text style={s.inlineError}>{fetchError}</Text>
          ) : null}

          {/* Outfit Selection */}
          <Text style={s.sectionLabel}>Choose your outfit</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.outfitListContent}
          >
            {outfits.map((outfit) => (
              <TouchableOpacity
                key={outfit.id}
                style={[
                  s.outfitCard,
                  selectedOutfit?.id === outfit.id && s.outfitCardSelected,
                  todayLog && s.outfitCardDisabled,
                ]}
                disabled={!!todayLog}
                onPress={() => setSelectedOutfit(outfit)}
                activeOpacity={0.75}
              >
                <View style={s.previewRow}>
                  {outfit.previewImages?.slice(0, 2).map((uri, index) => (
                    <Image key={index} source={{ uri }} style={s.miniPreview} />
                  ))}
                </View>
                <Text style={s.outfitName}>{outfit.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Rating */}
          <Text style={s.sectionLabel}>How did it feel?</Text>
          {todayLog ? (
            <Text style={s.readOnlyText}>Rating: {todayLog.rating || 0}</Text>
          ) : (
            renderStars()
          )}

          {/* Notes */}
          <Text style={s.sectionLabel}>Notes</Text>
          {todayLog ? (
            <Text style={s.readOnlyText}>{todayLog.notes || '-'}</Text>
          ) : (
            <TextInput
              style={s.notesInput}
              placeholder="How was your day? Any compliments?"
              placeholderTextColor={theme.colors.text.placeholder}
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          )}

          {/* Photos */}
          <Text style={s.sectionLabel}>Photos</Text>
          {todayLog ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.photoListContent}
            >
              {todayLog.photos?.map((uri, index) => (
                <Image key={index} source={{ uri }} style={s.photoPreview} />
              ))}
            </ScrollView>
          ) : (
            <>
              <TouchableOpacity
                style={s.photoButton}
                onPress={takePhoto}
                activeOpacity={0.75}
              >
                <MaterialIcons
                  name="camera-alt"
                  size={22}
                  color={theme.colors.primary.warmBrown}
                />
                <Text style={s.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.photoListContent}
              >
                {photos.map((uri, index) => (
                  <Image key={index} source={{ uri }} style={s.photoPreview} />
                ))}
              </ScrollView>
            </>
          )}

          {/* Save Button */}
          {!todayLog && (
            <TouchableOpacity
              style={[s.saveButton, saving && s.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.text.inverse}
                />
              ) : null}
              <Text style={s.saveButtonText}>
                {saving ? 'Saving…' : 'Log Today\'s Outfit'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScreenLayout>
  );
}
