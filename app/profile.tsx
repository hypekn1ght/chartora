import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Moon, CreditCard, CircleHelp as HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      
      <ScrollView style={styles.scrollView}>
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>John Doe</Text>
          <Text style={[styles.email, { color: colors.textDim }]}>john.doe@example.com</Text>
          <TouchableOpacity style={[styles.editButton, { borderColor: colors.border }]}>
            <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textDim }]}>
            PREFERENCES
          </Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBg, { backgroundColor: colors.primary + '20' }]}>
                  <Bell size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Notifications
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textDim} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBg, { backgroundColor: colors.secondary + '20' }]}>
                  <Moon size={20} color={colors.secondary} />
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                trackColor={{ false: '#767577', true: colors.primary + '70' }}
                thumbColor={isDarkMode ? colors.primary : '#f4f3f4'}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textDim }]}>
            ACCOUNT
          </Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBg, { backgroundColor: colors.accent + '20' }]}>
                  <CreditCard size={20} color={colors.accent} />
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Subscription
                </Text>
              </View>
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgeText}>FREE</Text>
                </View>
                <ChevronRight size={20} color={colors.textDim} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textDim }]}>
            SUPPORT
          </Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconBg, { backgroundColor: colors.chart.support + '20' }]}>
                  <HelpCircle size={20} color={colors.chart.support} />
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Help & Support
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textDim} />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.error + '10' }]}
        >
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.version, { color: colors.textDim }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    margin: 16,
    borderRadius: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 16,
    marginBottom: 8,
  },
  settingCard: {
    marginHorizontal: 16,
    borderRadius: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  divider: {
    height: 1,
    marginLeft: 56,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
  },
});