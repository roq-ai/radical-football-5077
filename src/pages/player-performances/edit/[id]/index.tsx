import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getPlayerPerformanceById, updatePlayerPerformanceById } from 'apiSdk/player-performances';
import { Error } from 'components/error';
import { playerPerformanceValidationSchema } from 'validationSchema/player-performances';
import { PlayerPerformanceInterface } from 'interfaces/player-performance';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlayerInterface } from 'interfaces/player';
import { getPlayers } from 'apiSdk/players';

function PlayerPerformanceEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlayerPerformanceInterface>(
    () => (id ? `/player-performances/${id}` : null),
    () => getPlayerPerformanceById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PlayerPerformanceInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePlayerPerformanceById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PlayerPerformanceInterface>({
    initialValues: data,
    validationSchema: playerPerformanceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Player Performance
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="game_date" mb="4">
              <FormLabel>game_date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.game_date}
                onChange={(value: Date) => formik.setFieldValue('game_date', value)}
              />
            </FormControl>
            <FormControl id="goals" mb="4" isInvalid={!!formik.errors?.goals}>
              <FormLabel>goals</FormLabel>
              <NumberInput
                name="goals"
                value={formik.values?.goals}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('goals', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.goals && <FormErrorMessage>{formik.errors?.goals}</FormErrorMessage>}
            </FormControl>
            <FormControl id="assists" mb="4" isInvalid={!!formik.errors?.assists}>
              <FormLabel>assists</FormLabel>
              <NumberInput
                name="assists"
                value={formik.values?.assists}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('assists', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.assists && <FormErrorMessage>{formik.errors?.assists}</FormErrorMessage>}
            </FormControl>
            <FormControl id="minutes_played" mb="4" isInvalid={!!formik.errors?.minutes_played}>
              <FormLabel>minutes_played</FormLabel>
              <NumberInput
                name="minutes_played"
                value={formik.values?.minutes_played}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('minutes_played', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.minutes_played && <FormErrorMessage>{formik.errors?.minutes_played}</FormErrorMessage>}
            </FormControl>
            <FormControl id="created_at" mb="4">
              <FormLabel>created_at</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.created_at}
                onChange={(value: Date) => formik.setFieldValue('created_at', value)}
              />
            </FormControl>
            <FormControl id="updated_at" mb="4">
              <FormLabel>updated_at</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.updated_at}
                onChange={(value: Date) => formik.setFieldValue('updated_at', value)}
              />
            </FormControl>
            <AsyncSelect<PlayerInterface>
              formik={formik}
              name={'player_id'}
              label={'player_id'}
              placeholder={'Select Player'}
              fetcher={getPlayers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.user_id}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'player_performance',
  operation: AccessOperationEnum.UPDATE,
})(PlayerPerformanceEditPage);
