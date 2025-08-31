---
layout: project
title: "Denoising Diffusion GANs and Latent Space Analysis"
date: 2025-01-01
summary: "Comprehensive exploration of DD-GAN on CelebA-HQ: training, evaluation, FID benchmarking, latent space analysis, semantic attribute editing, rejection sampling, and comparisons with StyleGAN."
image: /assets/projects/genai/cover.png   # Replace with a 16:9 cover image
tags: [dd-gan, diffusion, gan, latent-space, celeba, attribute-editing, genai]
links:
  - title: GitHub Repo
    url: https://github.com/btvvardhan/denoising-diffusion-gan
  - title: Final Report
    url: /assets/projects/genai/genai-project-report.pdf
---

# 🧠 Denoising Diffusion GANs and Latent Space Analysis

This project investigates **DD-GAN (Denoising Diffusion GANs)** — a hybrid model that merges **GANs and diffusion models** to achieve **fast, high-quality image generation** while maintaining multimodal diversity.  
The work goes beyond FID evaluation to perform a **deep latent space analysis**, exploring semantic attribute control, latent editing experiments, and rejection sampling for robust manipulation.

---

## 📌 Abstract

Generative modeling has advanced rapidly with **VAEs, GANs, and diffusion models**, but each faces trade-offs:
- **VAEs** → blurry images, but strong latent structure.
- **GANs** → sharp images, but training instability and mode collapse.
- **Diffusion models** → excellent quality and diversity, but slow sampling (hundreds of steps).

**DD-GAN** addresses the *generative trilemma* by combining adversarial training with diffusion’s denoising framework.  
This project trains DD-GAN on **CelebA-HQ**, evaluates it with **FID**, and demonstrates that DD-GAN’s latent space is **semantically meaningful and controllable**.

---

## 🔑 Keywords
`DD-GAN`, `Diffusion Models`, `GANs`, `Latent Space`, `Attribute Editing`, `CelebA-HQ`, `ResNet`, `FID`, `Generative AI`

---

## 📐 Architecture

DD-GAN integrates the following modules:

1. **Forward Diffusion**  
   - Adds Gaussian noise to input images.  
   - Uses only **T = 2 timesteps** (vs. 1000 in classical diffusion).  

2. **Conditional Generator (U-Net)**  
   - Inputs: noisy image `x_t`, timestep embedding, latent vector `z`.  
   - Outputs: denoised image `x_0`.  

3. **Posterior Sampling**  
   - Learns an approximate reverse distribution via adversarial training.  
   - Enables **sampling in 2–4 steps**.  

4. **Discriminator**  
   - Adversarial loss with **R1 regularization**.  
   - **Exponential Moving Average (EMA)** ensures stability.  

5. **Evaluation**  
   - Uses **FID** to measure image fidelity and diversity.  

---

## 🧪 Methodology

### ➤ Dataset
- **CelebA-HQ (128×128)**: Subset of 5000 images for DD-GAN training.  
- **Full CelebA (~200k images)**: Used for training attribute classifier with 40 attributes.  

![CelebA-HQ Samples](/assets/projects/genai/celeba_dataset.png)  
*Example CelebA-HQ images used for training (faces at 128×128 resolution).*

---

### ➤ Training Setup

| Config            | Value              |
|-------------------|--------------------|
| GPUs              | 3× NVIDIA A30 (24GB) |
| Epochs            | 1200              |
| Diffusion Steps   | 2                 |
| Batch Size        | 32                |
| Learning Rate     | 1e-4 (Dis), 2e-4 (Gen) |
| Attribute Classifier | ResNet-18 @ 256×256 |
| Classifier Epochs | 50 (loss ≈ 0.01) |

- **FID ≈ 17.16** (CelebA-HQ 128).  
- **Sample time ≈ 0.025 sec/image**.  

![FID Curve](/assets/projects/genai/fid_curve.png)  
*FID progression across epochs showing convergence.*

---

### ➤ Attribute Classifier Training

- Model: **ResNet-18**.  
- Input: 256×256 CelebA images.  
- Output: Multi-label prediction of 40 attributes (e.g., Smiling, Blond Hair, Eyeglasses).  
- Trained for **50 epochs**, achieving **loss ≈ 0.01** and strong accuracy.  
- Used for annotating generated DD-GAN samples.  

![Attribute Predictions](/assets/projects/genai/attribute_classifier.png)  
*Example predictions: “Smiling”, “Eyeglasses”, “Blond Hair” detected reliably.*

---

### ➤ Generating Latents + Attributes

- Generated **30,000 fake samples** from pretrained DD-GAN (epoch 550, T=2).  
- Saved:  
  - **Latent vectors** → `latents.npy`  
  - **Generated images** → `.jpg`  
  - **Predicted attributes** → `attributes.npy`  

![Generated Samples](/assets/projects/genai/generated_samples.png)  
*Examples of DD-GAN generated faces (128×128).*

---

### ➤ Finding Latent Directions

- For each attribute: trained **logistic regression** on `(latent vector, attribute)` pairs.  
- Learned **direction vectors** in latent space.  
- Examples:  
  - **Blond Hair Direction**  
  - **Eyeglasses Direction**  
  - **Smiling Direction**  

![Latent Directions](/assets/projects/genai/latent_directions.png)  
*Visualizing discovered latent directions corresponding to attributes.*

---

### ➤ Latent Editing Experiments

- Formula:  
  ```python
  latent_new = latent_original + α × direction
  ```
- Observations:  
  - **Positive Results**: “Smiling” and “Blond Hair” edits were clear.  
  - **Challenges**:  
    - **Entanglement**: editing hair color sometimes changed gender.  
    - **Large α** → distortions.  

![Latent Editing Results](/assets/projects/genai/latent_edits.png)  
*Latent editing results: original (top), edited with attribute directions (bottom).*

---

### ➤ Rejection Sampling

- Alternative to direct edits.  
- Workflow:  
  1. Generate many random samples.  
  2. Use classifier to predict attributes.  
  3. Keep only samples matching desired conditions.  

- **Advantages**:  
  - More reliable edits.  
  - Preserves image quality.  

- **Trade-offs**:  
  - Slower (requires many samples).  

![Rejection Sampling Examples](/assets/projects/genai/rejection_sampling.png)  
*Images selected via rejection sampling for “Eyeglasses” attribute.*

---

## 📊 Results

- **FID Score**: ~17 (CelebA-HQ 128).  
- **ResNet Attribute Classifier**: High accuracy, loss ≈ 0.01.  
- **Latent Editing**:  
  - Effective for **smile, blond hair, eyeglasses**.  
  - Limited precision due to entanglement.  
- **Rejection Sampling**: More robust, higher visual fidelity.  
- **Sampling Speed**: ~0.025 sec/image (real-time capable).  

![Results Summary](/assets/projects/genai/results_summary.png)  
*Performance summary: FID score, attribute editing, and rejection sampling reliability.*

---

## 📂 Repository Structure

```
.
├── custom_train_ddgan.py       # DD-GAN training
├── custom_test.py              # Generate images
├── train_celeba_256_classifier.py  # Train ResNet-18
├── predict_attributes.py       # Predict attributes
├── find_latent_directions.py   # Logistic regression directions
├── latent_image_generator.py   # Perform edits
├── progression.py              # Progressive edits
├── attr_verify.py              # Visualize attributes
├── generated_samples/          # Generated outputs
├── pytorch_fid/                # FID evaluation
└── requirements.txt
```

---

## 🧭 Usage Guide

### 1. Install
```bash
git clone https://github.com/btvvardhan/denoising-diffusion-gan.git
cd denoising-diffusion-gan
conda create -n ddgan python=3.8
conda activate ddgan
pip install -r requirements.txt
```

### 2. Train DD-GAN
```bash
python3 custom_train_ddgan.py --dataset custom_128 --image_size 128   --num_channels 3 --num_timesteps 2 --batch_size 32 --num_epoch 1200
```

### 3. Generate Samples
```bash
python3 custom_test.py --dataset custom_128 --epoch_id 1200 --batch_size 30000
```

### 4. Train Attribute Classifier
```bash
python train_celeba_256_classifier.py --data_root datasets/celeba --attr_file datasets/list_attr_celeba.txt
```

### 5. Predict Attributes
```bash
python predict_attributes.py --image_dir generated_samples/
```

### 6. Find Latent Directions
```bash
python find_latent_directions.py --attr_file generated_attributes.npy
```

### 7. Perform Latent Editing
```bash
python latent_image_generator.py
```

### 8. Rejection Sampling
```bash
python attr_verify.py
```

### 9. Evaluate with FID
```bash
python -m pytorch_fid generated_samples/ datasets/celeba_128/
```

---

## 🌍 Applications

- **Creative AI** → Face editing for art, animation, gaming.  
- **Healthcare** → Synthetic augmentation for medical datasets.  
- **Security** → Face reconstruction, forensics.  
- **Research** → Understanding generative model interpretability.  

---

## ⚠️ Challenges

- **Latent entanglement**: attributes interfere (e.g., beard ↔ male).  
- **Rare attributes** (hats, makeup) hard to edit due to limited training data.  
- **Linear edits** insufficient → require disentanglement techniques.  

![Entanglement Example](/assets/projects/genai/entanglement.png)  
*Example of attribute entanglement: changing hair color also changes gender.*

---

## 🔮 Future Work

- Attribute conditioning during training.  
- Multi-attribute disentanglement (InfoGAN, contrastive loss).  
- Train on full **CelebA-HQ (200k)** for richer control.  
- Optimization-based latent projection for cleaner edits.  

---

## 📘 Comparison: DD-GAN vs. StyleGAN

| Aspect            | DD-GAN (this work)       | StyleGAN               |
|-------------------|--------------------------|------------------------|
| Latent Control    | Coarse, noisy, global    | Fine-grained attribute |
| Diversity         | Very high (multimodal)   | Structured diversity   |
| Editing Precision | Medium (entanglement)    | High (precise edits)   |
| Sampling Speed    | Fast (2–4 steps)         | Moderate               |
| Application Focus | Diverse, fast generation | Targeted editing       |

![Comparison Chart](/assets/projects/genai/comparison.png)  
*Comparison of DD-GAN vs StyleGAN in terms of control, diversity, precision, and speed.*

---

## 📘 Reference

- Xiao, Z., Kreis, K., & Vahdat, A. (2022). *Tackling the Generative Learning Trilemma with Denoising Diffusion GANs*. ICLR.  
  🔗 https://openreview.net/forum?id=LbsDskdxfh

---

📄 **Full Report**: [Download PDF](/assets/projects/genai/genai-project-report.pdf)  
🔗 **GitHub Repository**: [DD-GAN Project](https://github.com/btvvardhan/denoising-diffusion-gan)  