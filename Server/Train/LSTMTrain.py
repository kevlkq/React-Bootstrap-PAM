import numpy as np
import pandas as pd
import tensorflow as tf
import keras
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM, BatchNormalization
from keras.callbacks import ReduceLROnPlateau, EarlyStopping
import os 
import sys
import joblib

csv_file_path = sys.argv[1]
target_column =  sys.argv[2]

df = pd.read_csv(csv_file_path)
x_columns = df.columns.drop(target_column)
x = df[x_columns].values
y = df[target_column].values

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=1, shuffle=True)

sc = MinMaxScaler()
x_train = sc.fit_transform(x_train)
x_test = sc.fit_transform(x_test)

x_train_reshaped = x_train.reshape(x_train.shape[0], 1, x_train.shape[1])
x_test_reshaped = x_test.reshape(x_test.shape[0], 1, x_test.shape[1])

model = Sequential()
model.add(LSTM(100, return_sequences=True, input_shape=(1, x_train.shape[1])))
model.add(BatchNormalization())
model.add(LSTM(50, return_sequences=True, activation='tanh'))
model.add(Dropout(0.5))
model.add(LSTM(10, return_sequences=True, activation='tanh'))
model.add(Dropout(0.5))
model.add(Dense(100, activation='relu'))
model.add(Dense(1))

model.compile(loss="mse", optimizer='adam')

reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.1, patience=4, min_lr=1e-7, verbose=1)

history = model.fit(
    x=x_train_reshaped,
    y=y_train,
    validation_data=(x_test_reshaped, y_test),  # Pass the validation data directly
    epochs=20,  # Increase the number of epochs
    batch_size=50,
    callbacks=[
        reduce_lr,
        EarlyStopping(monitor='val_loss', min_delta=1e-4, patience=10, mode='min', restore_best_weights=True)
    ],
)

model_filename = 'lstm_model.joblib'
model_path = 'models/' + model_filename
joblib.dump(model, model_path)


