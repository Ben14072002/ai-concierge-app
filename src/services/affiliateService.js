import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';

class AffiliateService {
  constructor() {
    this.affiliates = [];
  }

  async initialize(hostId) {
    try {
      const affiliatesRef = collection(db, 'affiliates');
      const q = query(affiliatesRef, where('hostId', '==', hostId));
      const querySnapshot = await getDocs(q);
      
      this.affiliates = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error initializing affiliates:', error);
    }
  }

  async addAffiliate(hostId, affiliateData) {
    try {
      const affiliatesRef = collection(db, 'affiliates');
      const docRef = await addDoc(affiliatesRef, {
        ...affiliateData,
        hostId,
        createdAt: new Date().toISOString(),
        commission: affiliateData.commission || 0,
        priority: affiliateData.priority || 1
      });

      const newAffiliate = {
        id: docRef.id,
        ...affiliateData,
        hostId,
        createdAt: new Date().toISOString(),
        commission: affiliateData.commission || 0,
        priority: affiliateData.priority || 1
      };

      this.affiliates.push(newAffiliate);
      return newAffiliate;
    } catch (error) {
      console.error('Error adding affiliate:', error);
      throw error;
    }
  }

  async updateAffiliate(affiliateId, updateData) {
    try {
      const affiliateRef = doc(db, 'affiliates', affiliateId);
      await updateDoc(affiliateRef, updateData);

      this.affiliates = this.affiliates.map(affiliate => 
        affiliate.id === affiliateId 
          ? { ...affiliate, ...updateData }
          : affiliate
      );
    } catch (error) {
      console.error('Error updating affiliate:', error);
      throw error;
    }
  }

  async deleteAffiliate(affiliateId) {
    try {
      const affiliateRef = doc(db, 'affiliates', affiliateId);
      await deleteDoc(affiliateRef);

      this.affiliates = this.affiliates.filter(affiliate => affiliate.id !== affiliateId);
    } catch (error) {
      console.error('Error deleting affiliate:', error);
      throw error;
    }
  }

  getAffiliatesByCategory(category) {
    return this.affiliates
      .filter(affiliate => affiliate.category === category)
      .sort((a, b) => b.priority - a.priority);
  }

  getAffiliateById(affiliateId) {
    return this.affiliates.find(affiliate => affiliate.id === affiliateId);
  }

  getAllAffiliates() {
    return this.affiliates;
  }
}

export const affiliateService = new AffiliateService(); 