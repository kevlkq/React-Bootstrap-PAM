import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib
import sys
import tensorflow as tf

from tensorflow import keras
from keras import layers
from keras.layers import Dense, LSTM
from keras.layers import BatchNormalization, Dropout
from keras.optimizers import Adam
from keras.models import Sequential
from keras.callbacks import ReduceLROnPlateau,EarlyStopping
import sklearn

import sys
import pandas as pd
import joblib
import numpy as np

import tensorflow as tf

from tensorflow import keras
from keras import layers
from keras.layers import Dense, LSTM
from keras.layers import BatchNormalization, Dropout
from keras.optimizers import Adam
from keras.models import Sequential
from keras.callbacks import ReduceLROnPlateau,EarlyStopping
import sklearn

csv_file_path = sys.argv[1]

model_path = r'C:\Users\luake\Github\React_PAM\Server\models\lstm_model.joblib'
model = joblib.load(model_path)

df = pd.read_csv(csv_file_path)

x_columns = df.columns
x_values = df[x_columns].values

scaler = StandardScaler()
x_scaled = scaler.fit_transform(x_values)

x_reshaped = np.reshape(x_scaled, (x_scaled.shape[0], 1, x_scaled.shape[1]))

# y_pred = model.predict(x_reshaped)
# y_pred = y_pred.flatten()


y_predicted = model.predict(x_reshaped)
y_predicted = y_predicted[:,0][:,0]



predicted_df = pd.DataFrame({'RUL_Prediction': y_predicted})

result_df = pd.concat([df, predicted_df], axis=1)
output_csv_file_path = 'Predictions/predicted_results_LSTM.csv'
result_df.to_csv(output_csv_file_path, index=False)

print("Predictions saved to predicted_results_LSTM.csv")





# import numpy as np
# import pandas as pd
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import StandardScaler
# from keras.models import Sequential
# from keras.layers import Dense, Dropout, LSTM
# from keras.callbacks import ReduceLROnPlateau
# import tensorflow as tf
# import time
# import sklearn
# import sys 

# model_performance = pd.DataFrame(columns=['Model', 'r-Squared', 'RMSE', 'Train Time', 'Prediction Time'])
# csv_file_path = sys.argv[1]
# # target_column = sys.argv[2]
# target_column = 'RUL'

# df = pd.read_csv(csv_file_path)
# x_columns = df.columns.drop(target_column)
# x = df[x_columns].values
# y = df[target_column].values

# model = Sequential()
# model.add(LSTM(100, return_sequences=True, input_shape=(1, x.shape[1])))
# model.add(Dense(1))

# model.compile(loss="mse", optimizer=tf.keras.optimizers.Adam(learning_rate=0.001))

# reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.1, patience=4, min_lr=1e-7, verbose=1)

# X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.1)

# X_train_reshaped = np.reshape(X_train, (X_train.shape[0], 1, X_train.shape[1]))
# X_test_reshaped = np.reshape(X_test, (X_test.shape[0], 1, X_test.shape[1]))

# start = time.time()
# history = model.fit(x=X_train_reshaped, y=y_train,
#                     validation_data=(X_test_reshaped, y_test),
#                     epochs=20,
#                     batch_size=500,
#                     callbacks=[reduce_lr])
# end_train = time.time()
# y_predictions = model.predict(X_test_reshaped)
# end_predict = time.time()
# y_predictions = y_predictions.flatten()
# model_performance.loc['LSTM'] = [sklearn.metrics.r2_score(y_test, y_predictions),
#                                   sklearn.metrics.mean_squared_error(y_test, y_predictions, squared=False),
#                                   end_train - start,
#                                   end_predict - end_train,
#                                   end_predict - start]

# rmse = sklearn.metrics.mean_squared_error(y_test, y_predictions, squared=False)
# r2error = sklearn.metrics.r2_score(y_test, y_predictions)
# print('AAAAAAA')
# print(rmse)
# print(r2error)