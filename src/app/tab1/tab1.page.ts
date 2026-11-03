import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

import { environment } from '../../environments/environment';

const app = getApps().length ? getApp() : initializeApp(environment.firebaseConfig);
const db = getFirestore(app);
const productsCol = collection(db, 'products');

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton],
})
export class Tab1Page {
  categories = ['Electronics', 'Clothing', 'Food', 'Home & Kitchen', 'Others'];

  newProduct: {
    productName: string;
    price: number | null;
    category: string;
    quantity: number | null;
  } = {
    productName: '',
    price: null,
    category: 'Electronics',
    quantity: null,
  };

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) {}

  async addProduct() {
    if (
      !this.newProduct.productName.trim() ||
      this.newProduct.price === null ||
      !this.newProduct.category.trim() ||
      this.newProduct.quantity === null
    ) {
      this.showToast('Please fill in all fields', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Saving product...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const productName = this.newProduct.productName.trim();
      await addDoc(productsCol, {
        productName,
        price: Number(this.newProduct.price),
        category: this.newProduct.category.trim(),
        quantity: Number(this.newProduct.quantity),
      });
      await loading.dismiss();
      this.showToast('Product added successfully!', 'success');
      this.newProduct = { productName: '', price: null, category: 'Electronics', quantity: null };
    } catch (error) {
      await loading.dismiss();
      this.showToast('Error adding product', 'danger');
      console.error(error);
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}